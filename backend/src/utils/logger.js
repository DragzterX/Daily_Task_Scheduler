const util = require('util');

function tidy(...args) {
  return args.map(a => (typeof a === 'object' ? util.inspect(a, { depth: 2 }) : a)).join(' ');
}

module.exports = {
  info: (...args) => console.log('[INFO]', tidy(...args)),
  warn: (...args) => console.warn('[WARN]', tidy(...args)),
  error: (...args) => console.error('[ERROR]', tidy(...args))
};
