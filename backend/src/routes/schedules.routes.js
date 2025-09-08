const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedules.controller');
const auth = require('../middleware/auth');
const { createScheduleValidator, updateScheduleValidator } = require('../validators/schedules.validator');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/', schedulesController.list);
router.post('/', createScheduleValidator, validate, schedulesController.create);
router.get('/:id', schedulesController.getById);
router.put('/:id', updateScheduleValidator, validate, schedulesController.update);
router.delete('/:id', schedulesController.remove);

module.exports = router;
