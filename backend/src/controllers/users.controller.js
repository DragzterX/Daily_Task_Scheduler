const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json({ ok: true, user });
});

exports.updateMe = catchAsync(async (req, res) => {
  const allowed = ['name', 'timezone', 'settings'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
  res.json({ ok: true, user });
});
