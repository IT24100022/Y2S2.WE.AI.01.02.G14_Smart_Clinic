const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Helper function to get date range filter
const getDateRangeFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }
  return filter;
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = getDateRangeFilter(startDate, endDate);

    // Get current period stats
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
      Appointment.countDocuments(dateFilter),
      Appointment.countDocuments({ ...dateFilter, status: 'pending' }),
      Appointment.countDocuments({ ...dateFilter, status: 'confirmed' }),
      Appointment.countDocuments({ ...dateFilter, status: 'completed' }),
      Appointment.countDocuments({ ...dateFilter, status: 'cancelled' })
    ]);

    // Get previous period stats for trends (same duration before start date)
    let prevFilter = {};
    if (startDate && endDate) {
      const currentStart = new Date(startDate);
      const currentEnd = new Date(endDate);
      const duration = currentEnd - currentStart;
      const prevStart = new Date(currentStart - duration);
      const prevEnd = new Date(currentStart);
      prevFilter = {
        createdAt: { $gte: prevStart, $lt: currentStart }
      };
    }

    const prevTotal = await Appointment.countDocuments(prevFilter);
    const prevCompleted = await Appointment.countDocuments({ ...prevFilter, status: 'completed' });
    const prevCancelled = await Appointment.countDocuments({ ...prevFilter, status: 'cancelled' });

    // Calculate trends (percentage change)
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    res.json({
      success: true,
      stats: {
        total: { value: total, trend: calculateTrend(total, prevTotal) },
        pending: { value: pending, trend: 0 },
        confirmed: { value: confirmed, trend: 0 },
        completed: { value: completed, trend: calculateTrend(completed, prevCompleted) },
        cancelled: { value: cancelled, trend: calculateTrend(cancelled, prevCancelled) }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get appointment status distribution
// @route   GET /api/admin/dashboard/status-distribution
// @access  Private (Admin only)
exports.getStatusDistribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = getDateRangeFilter(startDate, endDate);

    const distribution = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    const result = distribution.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
      status: item._id
    }));

    // Ensure all statuses are represented
    const allStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    allStatuses.forEach(status => {
      if (!result.find(r => r.status === status)) {
        result.push({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: 0,
          percentage: 0,
          status
        });
      }
    });

    res.json({ success: true, distribution: result, total });
  } catch (error) {
    console.error('Status distribution error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get appointment trends
// @route   GET /api/admin/dashboard/trends
// @access  Private (Admin only)
exports.getAppointmentTrends = async (req, res) => {
  try {
    const { period = 'week', startDate, endDate } = req.query;
    const dateFilter = getDateRangeFilter(startDate, endDate);

    let groupBy;
    let dateFormat;
    let limit;

    if (period === 'week') {
      // Last 7 days
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
      dateFormat = '%Y-%m-%d';
      limit = 7;
    } else if (period === 'month') {
      // Last 4 weeks
      groupBy = { $dateToString: { format: '%Y-W%U', date: '$date' } };
      dateFormat = '%Y-W%U';
      limit = 4;
    } else {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
      limit = 7;
    }

    const trends = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: limit }
    ]);

    res.json({ success: true, trends, period });
  } catch (error) {
    console.error('Appointment trends error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get doctor performance
// @route   GET /api/admin/dashboard/doctor-performance
// @access  Private (Admin only)
exports.getDoctorPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = getDateRangeFilter(startDate, endDate);

    const performance = await Appointment.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $group: {
          _id: '$doctorId',
          doctorName: { $first: '$doctorName' },
          completedCount: { $sum: 1 },
          totalAppointments: { $sum: 1 }
        }
      },
      { $sort: { completedCount: -1 } },
      { $limit: 10 }
    ]);

    // Get all appointments count per doctor
    const allAppointments = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$doctorId',
          totalAppointments: { $sum: 1 }
        }
      }
    ]);

    // Merge the data
    const result = performance.map(doc => {
      const allStats = allAppointments.find(a => a._id.toString() === doc._id.toString());
      return {
        doctorId: doc._id,
        doctorName: doc.doctorName || 'Unknown Doctor',
        completed: doc.completedCount,
        total: allStats ? allStats.totalAppointments : doc.completedCount
      };
    });

    res.json({ success: true, doctors: result });
  } catch (error) {
    console.error('Doctor performance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get recent appointments
// @route   GET /api/admin/dashboard/recent-appointments
// @access  Private (Admin only)
exports.getRecentAppointments = async (req, res) => {
  try {
    const { limit = 10, startDate, endDate } = req.query;
    const dateFilter = getDateRangeFilter(startDate, endDate);

    const appointments = await Appointment.find(dateFilter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .select('appointment_id patientName doctorName date time status reason createdAt');

    res.json({ success: true, appointments, total: appointments.length });
  } catch (error) {
    console.error('Recent appointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
