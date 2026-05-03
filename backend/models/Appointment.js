const mongoose = require('mongoose');
const Counter = require('./Counter');

const AppointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: String,
    unique: true,
    required: false, // Make optional for admin operations
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty value for auto-generation
        return /^APT[0-9]{4}$/.test(v);
      },
      message: 'Appointment ID must be in format APT followed by 4 digits (e.g., APT0001)'
    },
    maxlength: 8
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Make optional for admin operations
    validate: {
      validator: async function(v) {
        if (!v) return true; // Allow empty for admin operations
        try {
          const User = mongoose.model('User');
          const user = await User.findById(v);
          return user && user.role === 'patient';
        } catch (error) {
          return false;
        }
      },
      message: 'Valid patient ID is required'
    }
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Make optional for admin operations
    validate: {
      validator: async function(v) {
        if (!v) return true; // Allow empty for admin operations
        try {
          const User = mongoose.model('User');
          const user = await User.findById(v);
          return user && user.role === 'doctor';
        } catch (error) {
          return false;
        }
      },
      message: 'Valid doctor ID is required'
    }
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  doctorName: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(v) {
        // Skip validation for admin operations (check if this is an admin context)
        if (this && this.$isAdminOperation) {
          return true; // Allow any date for admin
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentDate = new Date(v);
        appointmentDate.setHours(0, 0, 0, 0);
        
        // Check if date is not in the past
        if (appointmentDate < today) {
          return false;
        }
        
        // Check if date is not more than 30 days in the future
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);
        return appointmentDate <= maxDate;
      },
      message: 'Appointment date must be today or within the next 30 days (cannot be in the past)'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    validate: {
      validator: function(v) {
        const validTimes = [
          '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
          '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
          '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
          '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
        ];
        return validTimes.includes(v);
      },
      message: 'Appointment time must be in 30-minute intervals between 9:00 AM and 5:00 PM'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled', 'completed'],
      message: 'Status must be one of: pending, confirmed, cancelled, completed'
    },
    default: 'pending'
  },
  reason: {
    type: String,
    default: '',
    maxlength: [500, 'Reason cannot exceed 500 characters'],
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
AppointmentSchema.index({ appointment_id: 1 }, { unique: true });
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ doctorId: 1 });
AppointmentSchema.index({ date: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1, time: 1 });

// Pre-save middleware to auto-generate appointment_id
AppointmentSchema.pre('save', async function(next) {
  // Update updatedAt on save
  this.updatedAt = Date.now();
  
  // Auto-generate appointment_id if not present
  if (!this.appointment_id) {
    try {
      const seq = await Counter.getNextSequence('appointment_id');
      this.appointment_id = `APT${seq.toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Validation middleware for time slot availability
AppointmentSchema.pre('save', async function(next) {
  if (this.isNew || (this.isModified('date') || this.isModified('time'))) {
    try {
      const existingAppointment = await this.constructor.findOne({
        doctorId: this.doctorId,
        date: this.date,
        time: this.time,
        status: { $ne: 'cancelled' },
        _id: { $ne: this._id }
      });
      
      if (existingAppointment) {
        const error = new Error('This time slot is already booked for the selected doctor');
        error.name = 'ValidationError';
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Validation middleware for status changes
AppointmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const oldStatus = this._originalStatus || 'pending';
    const newStatus = this.status;
    
    // Cannot reschedule appointment that is already completed or cancelled
    if ((oldStatus === 'completed' || oldStatus === 'cancelled') && 
        (this.isModified('date') || this.isModified('time'))) {
      const error = new Error('Cannot reschedule appointment that is already completed or cancelled');
      error.name = 'ValidationError';
      return next(error);
    }
    
    // Cannot cancel appointment that is already completed
    if (oldStatus === 'completed' && newStatus === 'cancelled') {
      const error = new Error('Cannot cancel appointment that is already completed');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  
  // Store original status for validation
  if (this.isModified('status') && !this._originalStatus) {
    this._originalStatus = this.getChanges().$set?.status || this.status;
  }
  
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);