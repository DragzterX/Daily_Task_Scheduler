const { body } = require('express-validator');

exports.registerValidator = [
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 6 }).withMessage('password min 6 chars'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('valid email required'),
  body('password').exists().withMessage('password required')
];
