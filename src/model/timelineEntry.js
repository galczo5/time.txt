const GLOBAL = require('./global.js');

const Settings = require('./settings.js');
const DateUtils = require('../utils/dateUtils.js');

class TimelineEntry {
    constructor(thisEntry, nextEntry) {
        this.name = thisEntry.name;
        this.tags = thisEntry.tags;
        this.hourFrom = thisEntry.hour;
        this.hourTo = nextEntry ? nextEntry.hour : 'now';

        // TODO:
        let endHour = nextEntry ? nextEntry.hour : GLOBAL.settings.getHour();

        this.hoursDiff = DateUtils.hoursDiff(thisEntry.hour, endHour, GLOBAL.settings.getHourFormatString());
        this.minutesDiff = DateUtils.minutesDiff(thisEntry.hour, endHour, GLOBAL.settings.getHourFormatString()) % 60;
    }

    toString() {
        let period = `${this.hourFrom} - ${this.hourTo}`;
        let timeDiff = `[${this.hoursDiff}h ${this.minutesDiff}m]`;
        timeDiff += ' '.repeat(9 - timeDiff.length);

        const periodColumnLength = GLOBAL.settings.hourFormat === 24 ? 14 : 18;
        period += ' '.repeat(periodColumnLength - period.length);

        let text = this.name
            .split(' ')
            .map(x => x.startsWith('+') ? x : x)
            .join(' ');

        return `${period} ${timeDiff} ${text}`;
    }

    print() {
        console.log(this.toString());
    }
}

module.exports = TimelineEntry;