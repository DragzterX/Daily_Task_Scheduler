const http = require('http');
const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');
const agendaService = require('./services/agenda');
const logger = require('./utils/logger');

const server = http.createServer(app);

async function start() {
  try {
    await db.connect();
    logger.info('MongoDB connected');

    // start agenda (background jobs)
    await agendaService.start();
    logger.info('Agenda started');

    server.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`API base: http://localhost:${env.PORT}/api`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('SIGINT received: shutting down');
  try {
    await agendaService.stop();
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
});
