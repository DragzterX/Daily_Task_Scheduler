const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (req, res, next) => {
  const auth = req.header('Authorization') || '';
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token = parts[1];
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
      req.user = { id: payload.sub, email: payload.email };
    } catch (err) {
      return res.status(401).json({ ok: false, error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ ok: false, error: 'Authorization required' });
  }
  return next();
};
