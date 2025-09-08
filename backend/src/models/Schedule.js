const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  method: { type: String, enum: ['local', 'push'], default: 'local' },
  minutesBefore: { type: Number, default: 0 }
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: String, enum: ['sleep', 'food', 'work', 'entertainment'], required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  startAt: { type: Date, required: true },
  endAt: { type: Date },
  allDay: { type: Boolean, default: false },
  rrule: { type: String, default: '' },
  timezone: { type: String, default: 'UTC' },
  reminders: { type: [ReminderSchema], default: [] },
  priority: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'snoozed', 'completed', 'cancelled'], default: 'active' },
  lastModified: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
});

ScheduleSchema.index({ userId: 1, startAt: 1 });

module.exports = mongoose.model('Schedule', ScheduleSchema);
