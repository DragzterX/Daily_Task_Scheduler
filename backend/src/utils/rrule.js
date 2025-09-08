const { rrulestr } = require('rrule');

exports.parseRRule = (rruleStr, dtstart) => {
  if (!rruleStr) return null;
  try {
    const dtstartStr = dtstart && dtstart.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ical = dtstartStr ? `DTSTART:${dtstartStr}\nRRULE:${rruleStr}` : `RRULE:${rruleStr}`;
    return rrulestr(ical);
  } catch (err) {
    return null;
  }
};
