const moment = require('moment');
const path = require('path');

function getFileNameFromDate(date) {
    return moment(date).format('YYYYMMDD') + '.txt';
}

function getFilePathFromDate(date, directory) {
    let fileName = getFileNameFromDate(date);
    return path.join(directory, fileName);
}

module.exports = {
    getFilePathFromDate,
    getFileNameFromDate
};