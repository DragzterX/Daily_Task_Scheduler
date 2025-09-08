const express = require('express');
const router = express.Router();
const devicesController = require('../controllers/devices.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/register', devicesController.registerToken);
router.post('/unregister', devicesController.unregisterToken);

module.exports = router;
