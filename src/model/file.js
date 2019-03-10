const fs = require('fs');
const colors = require('colors');

const OUTPUT_FORMAT = require('./outputFormat.js');
const PRINT_MODES = require('./printModes.js');
const GLOBAL = require('./global.js');

const Entry = require('./entry.js');
const TimelineEntry = require('./timelineEntry.js');
const ByTagDifference = require('./byTagDifference.js');
const DateUtils = require('../utils/dateUtils.js');
const Settings = require('./settings.js');

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

        this.sortEntries();
    }

    save() {
        this.sortEntries();
        let fileText = this.entries.map(e => e.toString()).join('\n');
        fs.writeFileSync(this.filePath, fileText);
    }

    getTimeline() {
        let timelineEntries = [];
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].stop)
                continue;

            timelineEntries.push(new TimelineEntry(this.entries[i], this.entries[i + 1]));
        }

        return timelineEntries;
    }

    getTags() {
        let byTags = {};
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].stop)
                continue;

            let { hoursDiff, minutesDiff } = this.getEntriesProps(this.entries, i);

            this.entries[i].tags.forEach(t => {
                if (t in byTags) {
                    byTags[t].addTime(hoursDiff, minutesDiff);
                    return;
                }

                byTags[t] = new ByTagDifference(t, hoursDiff, minutesDiff);
            });
        }

        return Object.values(byTags);
    }

    getEntriesProps(entries, i) {
        let thisEntry = entries[i];
        let nextEntry = entries[i + 1];

        // TODO:
        let endHour = nextEntry ? nextEntry.hour : GLOBAL.settings.getHour();

        let hoursDiff = DateUtils.hoursDiff(thisEntry.hour, endHour, GLOBAL.settings.getHourFormatString());
        let minutesDiff = DateUtils.minutesDiff(thisEntry.hour, endHour, GLOBAL.settings.getHourFormatString()) % 60;

        return { hoursDiff, minutesDiff };
    }
}

module.exports = File;
