const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, timezone } = req.body;
  const user = await authService.register({ name, email, password, timezone });
  res.status(201).json({ ok: true, user: { id: user._id, email: user.email, name: user.name } });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const tokens = await authService.login({ email, password });
  res.json({ ok: true, ...tokens });
});

exports.refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ ok: false, error: 'refreshToken required' });
  const tokens = await authService.refreshToken(refreshToken);
  res.json({ ok: true, ...tokens });
});

exports.logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await authService.revokeRefreshToken(refreshToken);
  res.json({ ok: true, message: 'logged out' });
});
