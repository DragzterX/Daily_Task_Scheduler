const bcrypt = require('bcryptjs');
const User = require('../models/User');
const tokenService = require('./token.service');
const httpStatus = require('../utils/httpStatus');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 10;

exports.register = async ({ name, email, password, timezone }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ name, email, passwordHash, timezone });
  await user.save();
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const tokens = await tokenService.generateAuthTokens(user);
  return tokens;
};

exports.refreshToken = async (refreshToken) => {
  return tokenService.refreshAuth(refreshToken);
};

exports.revokeRefreshToken = async (refreshToken) => {
  return tokenService.revokeRefreshToken(refreshToken);
};
