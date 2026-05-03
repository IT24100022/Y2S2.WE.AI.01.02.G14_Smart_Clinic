const MedicalRecord = require('../models/MedicalRecord');
const InventoryRecord = require('../models/InventoryRecord');

// @desc    Create new medical record
// @route   POST /api/records
// @access  Public (Doctor/Admin)
const createRecord = async (req, res) => {
  try {
    const {
      patient_id,
      patient_contact,
      doctor_id,
      record_type,
      title,
      description,
      file_url,
      record_date,
      quantity,
      supplier,
      serial_number,
      patient_name,
      sex,
      product_name
    } = req.body;

    const isInventory = record_type === 'inventory';

    if (isInventory) {
      // Inventory specific validation
      if (!product_name || !supplier || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Inventory records require product_name, supplier, and a positive quantity.' });
      }

      const newInventory = await InventoryRecord.create({
        product_name,
        supplier,
        quantity,
        serial_number: serial_number || '',
        doctor_id,
        description,
        file_url: file_url || '',
        record_date: record_date || new Date(),
        record_type: 'inventory'
      });

      return res.status(201).json(newInventory);
    } else {
      // Patient Record validation
      if (!patient_id || !patient_name || !sex) {
        return res.status(400).json({ message: 'Patient records require patient_id, patient_name, and sex.' });
      }

      const finalTitle = title || `${record_type.charAt(0).toUpperCase() + record_type.slice(1)} Entry`;

      const newPatientRecord = await MedicalRecord.create({
        patient_id,
        patient_name,
        sex,
        patient_contact: patient_contact || '',
        doctor_id,
        record_type,
        title: finalTitle,
        description,
        file_url: file_url || '',
        record_date: record_date || new Date()
      });

      return res.status(201).json(newPatientRecord);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating record', error: error.message });
  }
};

// @desc    Get full patient history (including matches in inventory if product_name matches patient_id)
// @route   GET /api/records/patient/:patient_id
// @access  Public
const getPatientHistory = async (req, res) => {
  try {
    const { patient_id } = req.params;

    // Fetch from both collections and merge
    const patientRecords = await MedicalRecord.find({ 
      patient_id, 
      is_deleted: false 
    });

    const inventoryRecords = await InventoryRecord.find({
      product_name: patient_id, 
      is_deleted: false
    });

    const merged = [...patientRecords, ...inventoryRecords].sort((a, b) => 
      new Date(b.record_date) - new Date(a.record_date)
    );

    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient history', error: error.message });
  }
};

// @desc    Get all records (admin view - merged)
// @route   GET /api/records
// @access  Public
const getAllRecords = async (req, res) => {
  try {
    const patientRecords = await MedicalRecord.find({ is_deleted: false });
    const inventoryRecords = await InventoryRecord.find({ is_deleted: false });

    const merged = [...patientRecords, ...inventoryRecords].sort((a, b) => 
      new Date(b.record_date) - new Date(a.record_date)
    );

    res.status(200).json(merged);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all records', error: error.message });
  }
};

// @desc    Update record
// @route   PUT /api/records/:record_id
// @access  Public
const updateRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Try finding in MedicalRecord first
    let record = await MedicalRecord.findById(record_id);
    let Model = MedicalRecord;

    // If not found, try InventoryRecord
    if (!record) {
      record = await InventoryRecord.findById(record_id);
      Model = InventoryRecord;
    }

    if (!record) {
      return res.status(404).json({ message: 'Record not found in any collection' });
    }

    if (record.is_deleted) {
      return res.status(400).json({ message: 'Cannot update a deleted record' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        record[key] = updateData[key];
      }
    });

    const updated = await record.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating record', error: error.message });
  }
};

// @desc    Soft delete record
// @route   DELETE /api/records/:record_id
// @access  Private/Admin
const deleteRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    let record = await MedicalRecord.findById(record_id);
    if (!record) {
      record = await InventoryRecord.findById(record_id);
    }

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    record.is_deleted = true;
    await record.save();

    res.status(200).json({ message: 'Record logically deleted', record_id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record', error: error.message });
  }
};

module.exports = {
  createRecord,
  getPatientHistory,
  getAllRecords,
  updateRecord,
  deleteRecord
};
