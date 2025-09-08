const mongoose = require('mongoose');
const env = require('./env'); // make sure you import env.js

const connect = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('[ERROR] Mongoose connection failed', err);
    process.exit(1);
  }
};

module.exports = { connect };
