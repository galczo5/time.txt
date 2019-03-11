const FileUtils = require('../utils/fileUtils.js');
const DateUtils = require('../utils/dateUtils.js');

const STOP_SIGN = '---STOP---';
const HOUR_FORMATS = {
    12: 'hh:mmA',
    24: 'HH:mm'
};

class Settings {
    constructor(directory, date, dateFormat, hourFormat, caseInsensitiveTags = false) {
        this.dateFormat = dateFormat || 'YYYY-MM-DD';
        this.hourFormat = hourFormat || 24;
        this.date = date || new Date();
        this.directory = directory;
        this.fileName = FileUtils.getFileNameFromDate(date);
        this.currentFilePath = FileUtils.getFilePathFromDate(date, directory);
        this.caseInsensitiveTags = caseInsensitiveTags;
        this.stopSign = STOP_SIGN;
    }

    getHourFormatString() {
        return HOUR_FORMATS[this.hourFormat];
    } 

    getHour() { 
        return DateUtils.getHour(this.date, this.getHourFormatString());
    }
}

module.exports = Settings;
