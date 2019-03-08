const path = require('path');

const FileUtils = require('../utils/fileUtils.js');
const DateUtils = require('../utils/dateUtils.js');

const SESSION = require('./session.js');
const OUTPUT_FORMAT = require('./outputFormat.js');

const HOUR_FORMATS = {
    12: 'hh:mmA',
    24: 'HH:mm'
};

class Settings {
    constructor(directory, date, dateFormat, hourFormat, caseInsensitiveTags = false) {
        this.dateFormat = dateFormat || 'YYYY-MM-DD';
        this.hourFormat = hourFormat || 24;
        this.date = date || SESSION.NOW;
        this.directory = directory;
        this.fileName = FileUtils.getFileNameFromDate(date);
        this.currentFilePath = FileUtils.getFilePathFromDate(date, directory);

        this.hourFormatString = HOUR_FORMATS[this.hourFormat];
        this.hour = DateUtils.getHour(this.date, this.hourFormatString);
        this.caseInsensitiveTags = caseInsensitiveTags;
    }
}

module.exports = Settings;
