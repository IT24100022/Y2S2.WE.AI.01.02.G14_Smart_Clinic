const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    type: String,
    enum: ['manage_users', 'manage_doctors', 'manage_appointments', 'view_reports', 'system_settings']
  }],
  department: {
    type: String,
    default: 'Administration'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);
