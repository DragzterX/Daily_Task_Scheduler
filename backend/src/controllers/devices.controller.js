const catchAsync = require('../utils/catchAsync');
const DeviceToken = require('../models/DeviceToken');

exports.registerToken = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { token, platform } = req.body;
  if (!token) return res.status(400).json({ ok: false, error: 'token required' });

  await DeviceToken.findOneAndUpdate(
    { userId, token },
    { userId, token, platform, lastSeen: new Date() },
    { upsert: true, new: true }
  );

  res.json({ ok: true });
});

exports.unregisterToken = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { token } = req.body;
  if (!token) return res.status(400).json({ ok: false, error: 'token required' });
  await DeviceToken.deleteOne({ userId, token });
  res.json({ ok: true });
});
