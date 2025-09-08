const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');

const FCM_KEY = env.FCM_SERVER_KEY;
const FCM_URL = env.FCM_API_URL;

exports.sendToTokens = async (tokens, payload) => {
  if (!tokens || tokens.length === 0) {
    logger.info('fcm: no tokens provided');
    return;
  }
  if (!FCM_KEY) {
    logger.info('FCM key not configured — would send:', { tokensCount: tokens.length, payload });
    return;
  }

  const body = {
    registration_ids: tokens,
    notification: { title: payload.title, body: payload.body },
    data: payload.data || {}
  };

  try {
    const res = await axios.post(FCM_URL, body, {
      headers: {
        Authorization: `key=${FCM_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    logger.info('fcm: sent', res.data);
    return res.data;
  } catch (err) {
    logger.error('fcm: error sending', err.response ? err.response.data : err.message);
    throw err;
  }
};

exports.sendToUser = async (userId, payload) => {
  const DeviceToken = require('../models/DeviceToken');
  const tokens = await DeviceToken.find({ userId }).lean();
  const tokenList = tokens.map(t => t.token).filter(Boolean);
  return this.sendToTokens(tokenList, payload);
};
