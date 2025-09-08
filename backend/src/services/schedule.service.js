const Schedule = require('../models/Schedule');
const { rrulestr } = require('rrule');
const agenda = require('./agenda');
const logger = require('../utils/logger');

const OCCURRENCE_WINDOW_DAYS = 30;

function expandOccurrencesForSchedule(schedule, from, to) {
  const occurrences = [];
  if (schedule.rrule && schedule.rrule.trim()) {
    try {
      const dtstart = schedule.startAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const ical = `DTSTART:${dtstart}\nRRULE:${schedule.rrule}`;
      const rule = rrulestr(ical);
      const between = rule.between(from, to, true);
      between.forEach(d => {
        occurrences.push({
          scheduleId: schedule._id,
          title: schedule.title,
          module: schedule.module,
          startAt: d,
          originalStart: schedule.startAt
        });
      });
    } catch (err) {
      logger.error('rrule parse error', err);
    }
  } else {
    const s = schedule.startAt;
    if ((!from || s >= from) && (!to || s <= to)) {
      occurrences.push({
        scheduleId: schedule._id,
        title: schedule.title,
        module: schedule.module,
        startAt: schedule.startAt,
        originalStart: schedule.startAt
      });
    }
  }
  return occurrences;
}

exports.createSchedule = async ({ userId, payload }) => {
  const doc = new Schedule(Object.assign({}, payload, { userId }));
  doc.lastModified = new Date();
  await doc.save();

  try {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + OCCURRENCE_WINDOW_DAYS);
    const occurrences = expandOccurrencesForSchedule(doc, from, to);
    for (const occ of occurrences) {
      if (doc.reminders && doc.reminders.length > 0) {
        for (const rem of doc.reminders) {
          if (rem.method === 'push') {
            const when = new Date(occ.startAt.getTime() - (rem.minutesBefore || 0) * 60000);
            if (when > new Date()) {
              await agenda.scheduleJobWhen(when, 'sendPushReminder', {
                scheduleId: doc._id,
                userId,
                title: `Upcoming: ${doc.title}`,
                body: `Starts at ${occ.startAt.toISOString()}`,
                meta: { remindMinutesBefore: rem.minutesBefore }
              });
            }
          }
        }
      }
    }
  } catch (err) {
    logger.error('Error scheduling push reminder jobs', err);
  }

  return doc;
};

exports.getScheduleById = async ({ userId, id }) => {
  return Schedule.findOne({ _id: id, userId });
};

exports.updateSchedule = async ({ userId, id, payload }) => {
  const doc = await Schedule.findOneAndUpdate({ _id: id, userId }, Object.assign({}, payload, { lastModified: new Date() }), { new: true });
  return doc;
};

exports.deleteSchedule = async ({ userId, id }) => {
  await Schedule.findOneAndDelete({ _id: id, userId });
};
