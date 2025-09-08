const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/error');
const env = require('./config/env');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api', routes);

// Root health
app.get('/', (req, res) => res.json({ ok: true, message: 'Daily Task Scheduler API' }));

// Error handler (last)
app.use(errorHandler);

module.exports = app;
