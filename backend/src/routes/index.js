const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const schedulesRoutes = require('./schedules.routes');
const usersRoutes = require('./users.routes');
const devicesRoutes = require('./devices.routes');

// Root route to test backend
//router.get('/', (req, res) => {
//  res.json({ message: 'Backend is running!' });
//});

// Mount other routers
router.use('/auth', authRoutes);
router.use('/schedules', schedulesRoutes);
router.use('/users', usersRoutes);
router.use('/devices', devicesRoutes);

module.exports = router;
