const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('_id name email phone')
      .sort({ name: 1 });

    res.json({ success: true, doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
