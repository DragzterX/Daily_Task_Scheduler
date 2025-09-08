const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Unhandled error', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ ok: false, error: message, details: err.details || null });
};
