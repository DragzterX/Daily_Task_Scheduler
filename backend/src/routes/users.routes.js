const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/me', usersController.getMe);
router.put('/me', usersController.updateMe);

module.exports = router;
