const express = require('express');
const {
  bookAppointment,
  getAvailableSlots,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  rescheduleAppointment,
  confirmAppointment,
  completeAppointment,
  getAppointmentStats,
  getAllAppointments,
  updateAppointmentByAdmin,
  deleteAppointmentByAdmin
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableSlots);

// Protected routes
router.use(protect);

// Patient routes
router.post('/book', authorize('patient'), bookAppointment);
router.get('/my-appointments', authorize('patient'), getMyAppointments);
router.put('/cancel/:id', authorize('patient'), cancelAppointment);
router.put('/reschedule/:id', authorize('patient'), rescheduleAppointment);
router.get('/stats', authorize('patient'), getAppointmentStats);

// Doctor routes
router.get('/doctor-appointments', authorize('doctor'), getDoctorAppointments);
router.put('/confirm/:id', authorize('doctor'), confirmAppointment);
router.put('/complete/:id', authorize('doctor'), completeAppointment);

// Admin routes
router.get('/all', authorize('admin'), getAllAppointments);
router.put('/admin/:id', authorize('admin'), updateAppointmentByAdmin);
router.delete('/admin/:id', authorize('admin'), deleteAppointmentByAdmin);

module.exports = router;