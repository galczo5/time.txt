const DateUtils = require('./dateUtils.js');
const SESSION = require('./session.js');

class TimelineEntry {
    constructor(thisEntry, nextEntry) {
        this.name = thisEntry.name;
        this.tags = thisEntry.tags;
        this.hourFrom = thisEntry.hour;
        this.hourTo = nextEntry ? nextEntry.hour : '';

        // TODO:
        let endHour = nextEntry ? nextEntry.hour : SESSION.SETTINGS.hour;

        this.hoursDiff = DateUtils.hoursDiff(thisEntry.hour, endHour);
        this.minutesDiff = DateUtils.minutesDiff(thisEntry.hour, endHour) % 60;
    }

    toString() {
        let period = `${this.hourFrom} - ${this.hourTo}`;
        let timeDiff = `[${this.hoursDiff}h ${this.minutesDiff}m]`.bold.green;

        let text = this.name
            .split(' ')
            .map(x => x.startsWith('+') ? x.bold.red : x)
            .join(' ');

        return `${period} ${timeDiff} ${text}`;
    }

    print() {
        console.log(this.toString());
    }
}

module.exports = TimelineEntry;