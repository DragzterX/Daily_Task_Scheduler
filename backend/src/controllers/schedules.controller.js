const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/schedule.service');

exports.list = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  const moduleFilter = req.query.module || null;
  const occurrences = await scheduleService.getOccurrences({ userId, from, to, module: moduleFilter });
  res.json({ ok: true, occurrences });
});

exports.create = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const item = await scheduleService.createSchedule({ userId, payload: req.body });
  res.status(201).json({ ok: true, schedule: item });
});

exports.getById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const item = await scheduleService.getScheduleById({ userId, id });
  if (!item) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, schedule: item });
});

exports.update = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const item = await scheduleService.updateSchedule({ userId, id, payload: req.body });
  res.json({ ok: true, schedule: item });
});

exports.remove = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  await scheduleService.deleteSchedule({ userId, id });
  res.json({ ok: true, message: 'deleted' });
});
