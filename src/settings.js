const moment = require('moment');
const path = require('path');
const FileUtils = require('./fileUtils.js');

const GLOBAL = require('./globals.js');
const OUTPUT_FORMAT = require('./outputFormat.js');

const HOUR_FORMATS = {
    12: 'hh:mmA',
    24: 'HH:mm'
};

class Settings {
    constructor(directory, date, dateFormat, hourFormat) {
        this.dateFormat = dateFormat || 'YYYY-MM-DD';
        this.hourFormat = hourFormat || 24;
        this.date = date || GLOBAL.NOW;
        this.directory = directory;
        this.fileName = FileUtils.getFileNameFromDate(date);
        this.filePath = FileUtils.getFilePathFromDate(date, directory);

        this.hourFormatString = HOUR_FORMATS[this.hourFormat];
        this.hour = moment(this.date).format(this.hourFormatString);

        this.outputFormat = OUTPUT_FORMAT.TEXT;
    }
}

module.exports = Settings;
