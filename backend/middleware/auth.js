const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  // Demo auth mode to support the frontend's role-switch login.
  // For demo token, resolve users from DB so IDs match persisted data.
  if (token === 'test-token') {
    const role = req.headers['x-user-role'] || 'patient';
    const demoEmailByRole = {
      patient: 'patient@dentai.com',
      doctor: 'sarah@dentai.com',
      admin: 'admin@dentai.com'
    };
    const requestedDoctorEmail = req.headers['x-demo-doctor-email'];

    try {
      let user;
      if (role === 'doctor' && requestedDoctorEmail) {
        user = await User.findOne({ email: requestedDoctorEmail, role: 'doctor' });
      }

      if (!user) {
        user = await User.findOne({ email: demoEmailByRole[role] });
      }

      // Fallback: first user in role if seeded email doesn't exist.
      if (!user) {
        user = await User.findOne({ role });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: `Demo ${role} user not found in database. Run: npm run seed`
        });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };