const express = require('express');
const router = express.Router();
const {
  createRecord,
  getPatientHistory,
  getAllRecords,
  updateRecord,
  deleteRecord
} = require('../controllers/medicalRecordController');
const { adminOnly } = require('../middleware/authMiddleware');

router.post('/', createRecord);
router.get('/', getAllRecords);
router.get('/patient/:patient_id', getPatientHistory);
router.put('/:record_id', updateRecord);
router.delete('/:record_id', adminOnly, deleteRecord);

module.exports = router;
