const express = require('express');
const {
  getDashboardStats,
  getStatusDistribution,
  getAppointmentTrends,
  getDoctorPerformance,
  getRecentAppointments
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/status-distribution', getStatusDistribution);
router.get('/trends', getAppointmentTrends);
router.get('/doctor-performance', getDoctorPerformance);
router.get('/recent-appointments', getRecentAppointments);

module.exports = router;
