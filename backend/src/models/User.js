const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, trim: true, unique: true, required: true },
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  timezone: { type: String, default: 'UTC' },
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
