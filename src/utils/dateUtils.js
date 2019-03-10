const moment = require('moment');

function format(date, dateFormat) {
    return moment(date).format(dateFormat);
}

function getHour(date, hourFormat) {
    return moment(date).format(hourFormat);
}

function range(from, to, dateFormat) {
    let fromMoment = moment(from, dateFormat);
    let toMoment = moment(to, dateFormat);

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

function diff(hourFrom, hourTo, hourFormat, diffType) {
    let fromMoment = moment(hourFrom, hourFormat);
    let toMoment = moment(hourTo, hourFormat);

    return toMoment.diff(fromMoment, diffType);
}

function hoursDiff(hourFrom, hourTo, hourFormat) {
    return diff(hourFrom, hourTo, hourFormat, 'hours');
}

function minutesDiff(hourFrom, hourTo, hourFormat) {
    return diff(hourFrom, hourTo, hourFormat, 'minutes');
}

module.exports = {
    format,
    getHour,
    range,
    toFileNameDateFormat,
    hoursDiff,
    minutesDiff
};