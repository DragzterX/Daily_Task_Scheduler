const mongoose = require('mongoose');

const DeviceTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  platform: { type: String, enum: ['android', 'ios', 'web'], default: 'android' },
  lastSeen: { type: Date, default: Date.now }
});

DeviceTokenSchema.index({ userId: 1 });

module.exports = mongoose.model('DeviceToken', DeviceTokenSchema);
