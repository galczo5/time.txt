const moment = require('moment');
const SESSION = require('./session.js');

function format(date) {
    return moment(date).format(SESSION.SETTINGS.dateFormat);
}

function getHour(date, hourFormat) {
    return moment(date).format(hourFormat || SESSION.SETTINGS.hourFormatString);
}

function range(from, to) {
    let fromMoment = moment(from, SESSION.SETTINGS.dateFormat);
    let toMoment = moment(to, SESSION.SETTINGS.dateFormat);

    let range = [];

    let diff = toMoment.diff(fromMoment, 'days');
    for (let i = 0; i <= diff; i++) {
        let day = fromMoment.add(i, 'days');
        range.push(day.toDate());
    }

    return range;
}

function toFileNameDateFormat(date) {
    return moment(date).format('YYYYMMDD');
}

function diff(hourFrom, hourTo, diffType) {
    let fromMoment = moment(hourFrom, SESSION.SETTINGS.hourFormatString);
    let toMoment = moment(hourTo, SESSION.SETTINGS.hourFormatString);

    return toMoment.diff(fromMoment, diffType);
}

function hoursDiff(hourFrom, hourTo) {
    return diff(hourFrom, hourTo, 'hours');
}

function minutesDiff(hourFrom, hourTo) {
    return diff(hourFrom, hourTo, 'minutes');
}

module.exports = {
    format,
    getHour,
    range,
    toFileNameDateFormat,
    hoursDiff,
    minutesDiff
};