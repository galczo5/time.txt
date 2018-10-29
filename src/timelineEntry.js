const moment = require('moment');

class TimelineEntry {
    constructor(thisEntry, nextEntry) {
        this.name = thisEntry.name;
        this.tags = thisEntry.tags;
        this.hourFrom = thisEntry.hour;
        this.hourTo = nextEntry ? nextEntry.hour : '';

        let startHour = thisEntry.getMoment();
            let endHour = nextEntry ? nextEntry.getMoment() : moment();

            this.hoursDiff = endHour.diff(startHour, 'hours');
            this.minutesDiff = endHour.diff(startHour, 'minutes') % 60;
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
    }

module.exports = TimelineEntry;