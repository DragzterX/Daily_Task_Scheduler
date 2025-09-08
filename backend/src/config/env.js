const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const required = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET'
];

required.forEach((k) => {
  if (!process.env[k]) {
    console.warn(`WARNING: env var ${k} is not set`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/daily_task_app',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'replace_me_access_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'replace_me_refresh_secret',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'UTC',
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',
  FCM_API_URL: process.env.FCM_API_URL || 'https://fcm.googleapis.com/fcm/send'
};
