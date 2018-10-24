const moment = require('moment');
const GLOBAL = require('./globals.js');

class Entry {
    constructor({
        hour = null,
        name = '',
        stop = null
    } = {}) {
        this.hour = hour;
        this.name = stop ? GLOBAL.STOP_SIGN : name;
        this.tags = [];
        this.processTags();
        this.stop = stop || name.includes(GLOBAL.STOP_SIGN);
    }

    processTags() {
        let chunks = this.name.split(' ');
        this.tags = chunks.filter(c => c.startsWith('+'));
    }

    fromString(str, settings) {
        let chunks = str.split(' ');
        this.hour =  chunks[0];
        this.name = chunks.slice(1, chunks.length).join(' ');

        if (this.name.indexOf(GLOBAL.STOP_SIGN) !== -1)
            this.stop = true;

        this.processTags();
    }

    toString(settings) {
        return this.hour + ' ' + this.name;
    }

    getMoment() {
        return moment(this.hour, GLOBAL.SETTINGS.hourFormatString)
    }
}

module.exports = Entry;
