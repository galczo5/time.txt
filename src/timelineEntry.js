const SESSION = require('./session.js');
const DateUtils = require('./dateUtils.js');

class TimelineEntry {
    constructor(thisEntry, nextEntry) {
        this.name = thisEntry.name;
        this.tags = thisEntry.tags;
        this.hourFrom = thisEntry.hour;
        this.hourTo = nextEntry ? nextEntry.hour : 'now';

        // TODO:
        let endHour = nextEntry ? nextEntry.hour : SESSION.SETTINGS.hour;

        this.hoursDiff = DateUtils.hoursDiff(thisEntry.hour, endHour);
        this.minutesDiff = DateUtils.minutesDiff(thisEntry.hour, endHour) % 60;
    }

    toString() {
        let period = `${this.hourFrom} - ${this.hourTo}`;
        let timeDiff = `[${this.hoursDiff}h ${this.minutesDiff}m]`;
        timeDiff += ' '.repeat(9 - timeDiff.length);

        const periodColumnLength = SESSION.SETTINGS.hourFormat === 24 ? 14 : 18;
        period += ' '.repeat(periodColumnLength - period.length);

        let text = this.name
            .split(' ')
            .map(x => x.startsWith('+') ? x.bold.red : x)
            .join(' ');

        return `${period} ${timeDiff.bold.green} ${text}`;
    }

    print() {
        console.log(this.toString());
    }
}

module.exports = TimelineEntry;