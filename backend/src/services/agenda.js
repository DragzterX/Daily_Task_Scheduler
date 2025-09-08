const Agenda = require('agenda');
const env = require('../config/env');
const logger = require('../utils/logger');
const fcmService = require('./fcm.service');
const DeviceToken = require('../models/DeviceToken');
const Schedule = require('../models/Schedule');

let agenda;

async function init() {
  agenda = new Agenda({ db: { address: env.MONGODB_URI, collection: 'agendaJobs' } });

  agenda.define('sendPushReminder', async (job, done) => {
    try {
      const data = job.attrs.data || {};
      const { scheduleId, userId, title, body, meta } = data;

      if (scheduleId) {
        const s = await Schedule.findById(scheduleId);
        if (!s || s.status !== 'active') {
          logger.info('Skipping job: schedule not active', scheduleId);
          return done();
        }
      }

      const tokens = await DeviceToken.find({ userId }).lean();
      const tokenList = tokens.map(t => t.token).filter(Boolean);

      const payload = {
        title: title || 'Reminder',
        body: body || (meta && meta.text) || 'You have a scheduled item',
        data: { scheduleId: scheduleId ? String(scheduleId) : undefined }
      };

      if (tokenList.length > 0) {
        await fcmService.sendToTokens(tokenList, payload);
        logger.info('sendPushReminder: sent to tokens', tokenList.length);
      } else {
        logger.info('sendPushReminder: no device tokens for user', userId, 'payload', payload);
      }
      done();
    } catch (err) {
      logger.error('sendPushReminder job failed', err);
      done(err);
    }
  });

  return agenda;
}

async function start() {
  if (!agenda) await init();
  await agenda.start();
  return agenda;
}

async function stop() {
  if (agenda) await init();
  await agenda.stop();
}

async function scheduleJobWhen(dateOrWhen, jobName, data) {
  if (!agenda) await init();
  return agenda.schedule(dateOrWhen, jobName, data);
}

async function cancelJobs(query) {
  if (!agenda) await init();
  return agenda.cancel(query);
}

module.exports = {
  init,
  start,
  stop,
  scheduleJobWhen,
  cancelJobs,
  _getAgenda: () => agenda
};
