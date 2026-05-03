const mongoose = require('mongoose');

const inventoryRecordSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    supplier: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    serial_number: {
      type: String,
      default: ''
    },
    doctor_id: {
      type: String,
      required: true
    },
    record_type: {
      type: String,
      default: 'inventory'
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
    collection: 'inventoryrecords', // Exact name from screenshot
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

const InventoryRecord = mongoose.model('InventoryRecord', inventoryRecordSchema);

module.exports = InventoryRecord;
