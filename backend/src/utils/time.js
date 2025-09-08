const { DateTime } = require('luxon');

exports.toUTCDate = (value) => {
  if (!value) return null;
  const dt = DateTime.fromJSDate(new Date(value)).toUTC();
  return dt.toJSDate();
};

exports.formatForLocal = (date, zone = 'UTC') => {
  if (!date) return null;
  return DateTime.fromJSDate(date).setZone(zone).toFormat('yyyy-LL-dd HH:mm');
};
