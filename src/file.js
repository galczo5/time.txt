const fs = require('fs');
const colors = require('colors');
const moment = require('moment');
const Entry = require('./entry.js');
const GLOBAL = require('./globals.js');

class ByTagDifference {
    constructor(h, m) {
        this.hours = h;
        this.minutes = m;
    }

    addTime(h, m) {
        this.hours += h;
        this.minutes += m;

        if (this.minutes > 60) {
            this.hours++;
            this.minutes %= 60;
        }
    }
}

class File {
    constructor(filePath) {
        this.filePath = filePath;
        this.entries = [];
    }

    addEntry(entry) {
        this.entries.push(entry);
        this.sortEntries();
    }

    sortEntries() {
        this.entries.sort((a, b) => a.hour.localeCompare(b.hour));
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            let fileString = fs.readFileSync(this.filePath, 'utf8');
            this.entries = fileString
                .split('\n')
                .filter(e => e.length != 0)
                .map(e => {
                    let entry = new Entry();
                    entry.fromString(e);
                    return entry;
                });
        }
        else
            fs.openSync(this.filePath, 'w');

        this.sortEntries();
    }

    save() {
        this.sortEntries();
        let fileText = this.entries.map(e => e.toString()).join('\n');
        fs.writeFileSync(this.filePath, fileText);
    }

    printRaport(tags = []) {
        this.printTimeline(this.entries);
        console.log('--');
        this.printByTags(this.entries);
    }


    printTimeline(entries) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].stop)
                continue;

            let { text, period, timeDiff } = this.getEntriesProps(entries, i);
            console.log(`${period} ${timeDiff} ${text}`);
        }
    }

    printByTags(entries) {
        let byTags = {};
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].stop)
                continue;

            let { hoursDiff, minutesDiff } = this.getEntriesProps(entries, i);

            entries[i].tags.forEach(t => {
                if (t in byTags)
                    byTags[t].addTime(hoursDiff, minutesDiff);
                else
                    byTags[t] = new ByTagDifference(hoursDiff, minutesDiff);
            });
        }

        for (let t in byTags)
            console.log(`[${byTags[t].hours}h ${byTags[t].minutes}m] ${t.bold.red} `);
    }

    getEntriesProps(entries, i) {
        let thisEntry = entries[i];
        let nextEntry = entries[i + 1];
        let startHour = thisEntry.getMoment();
        let endHour = nextEntry ? nextEntry.getMoment() : moment();
        let hoursDiff = endHour.diff(startHour, 'hours');
        let minutesDiff = endHour.diff(startHour, 'minutes') % 60;

        let period = `${thisEntry.hour} - ${nextEntry ? nextEntry.hour : ''}`;
        let timeDiff = `[${hoursDiff}h ${minutesDiff}m]`.bold.green;

        let text = thisEntry.name
                            .split(' ')
                            .map(x => x.startsWith('+') ? x.bold.red : x)
                            .join(' ');

        return { text, period, timeDiff, hoursDiff, minutesDiff };
    }
}

module.exports = File;
