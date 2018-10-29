const moment = require('moment');
const path = require('path');

const GLOBAL = require('./globals.js');
const OUTPUT_FORMAT = require('./outputFormat.js');

const HOUR_FORMATS = {
    12: 'hh:mmA',
    24: 'HH:mm'
};

class Settings {
    constructor(directory, date, hourFormat, outputFormat) {
        this.hourFormat = hourFormat || 24;
        this.date = date || GLOBAL.NOW;
        this.fileName = moment(date).format('YYYYMMDD') + '.txt';
        this.filePath = path.join(directory, this.fileName);

        this.hourFormatString = HOUR_FORMATS[this.hourFormat];
        this.hour = moment(this.date).format(this.hourFormatString);
        this.outputFormat = outputFormat || OUTPUT_FORMAT.TEXT;
    }
}

module.exports = Settings;
