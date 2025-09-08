const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const env = require('../config/env');

function msToDate(durationStr) {
  const num = parseInt(durationStr.slice(0, -1), 10);
  const unit = durationStr.slice(-1);
  const now = new Date();
  if (unit === 'm') now.setMinutes(now.getMinutes() + num);
  else if (unit === 'h') now.setHours(now.getHours() + num);
  else if (unit === 'd') now.setDate(now.getDate() + num);
  else now.setDate(now.getDate() + num);
  return now;
}

exports.generateAccessToken = (user) => {
  return jwt.sign({ sub: user._id, email: user.email }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES
  });
};

exports.generateRefreshToken = async (user) => {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = msToDate(env.JWT_REFRESH_EXPIRES || '7d');
  const rt = new RefreshToken({ token, user: user._id, expiresAt });
  await rt.save();
  return token;
};

exports.generateAuthTokens = async (user) => {
  const accessToken = this.generateAccessToken(user);
  const refreshToken = await this.generateRefreshToken(user);
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name } };
};

exports.refreshAuth = async (refreshToken) => {
  const dbToken = await RefreshToken.findOne({ token: refreshToken, revokedAt: { $exists: false } }).populate('user');
  if (!dbToken) throw new Error('Invalid refresh token');
  if (dbToken.expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }
  dbToken.revokedAt = new Date();
  await dbToken.save();
  return this.generateAuthTokens(dbToken.user);
};

exports.revokeRefreshToken = async (refreshToken) => {
  await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revokedAt: new Date() });
};
