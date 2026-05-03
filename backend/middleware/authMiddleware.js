const adminOnly = (req, res, next) => {
  const role = req.headers['x-user-role'];

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }

  next();
};

module.exports = { adminOnly };
