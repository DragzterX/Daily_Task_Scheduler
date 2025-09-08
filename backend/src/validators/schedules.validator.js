const { body } = require('express-validator');

exports.createScheduleValidator = [
  body('module').isIn(['sleep', 'food', 'work', 'entertainment']).withMessage('module invalid'),
  body('title').isString().notEmpty().withMessage('title required'),
  body('startAt').isISO8601().withMessage('startAt must be ISO date'),
];

exports.updateScheduleValidator = [
  body('module').optional().isIn(['sleep', 'food', 'work', 'entertainment']).withMessage('module invalid'),
  body('title').optional().isString().notEmpty().withMessage('title required'),
  body('startAt').optional().isISO8601().withMessage('startAt must be ISO date')
];
