const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true
    },
    patient_name: {
      type: String,
      required: true
    },
    patient_contact: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    },
    doctor_id: {
      type: String,
      required: true
    },
    record_type: {
      type: String,
      required: true,
      enum: ['xray', 'photo', 'report', 'schedule']
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
      default: ''
    },
    record_date: {
      type: Date,
      required: true,
      default: Date.now
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'medicalrecords', // Exact name from screenshot
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;
