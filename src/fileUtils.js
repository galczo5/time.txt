const DateUtils = require('./dateUtils.js');
const path = require('path');

function getFileNameFromDate(date) {
    return DateUtils.toFileNameDateFormat(date) + '.txt';
}

function getFilePathFromDate(date, directory) {
    let fileName = getFileNameFromDate(date);
    return path.join(directory, fileName);
}

module.exports = {
    getFilePathFromDate,
    getFileNameFromDate
};