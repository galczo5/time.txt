const fs = require('fs');
const colors = require('colors');
const moment = require('moment');
const Entry = require('./entry.js');
const GLOBAL = require('./globals.js');
const OUTPUT_FORMAT = require('./outputFormat.js');
const PRINT_MODES = require('./printModes.js');
const TimelineEntry = require('./timelineEntry.js');
const ByTagDifference = require('./byTagDifference.js');

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

    printReport(printMode) {
        let timeline = this.getTimeline(this.entries);
        let tags = this.getByTags(this.entries);

        if (GLOBAL.SETTINGS.outputFormat === OUTPUT_FORMAT.TEXT)
            this.printTextReport(timeline, tags, printMode);

        else if (GLOBAL.SETTINGS.outputFormat === OUTPUT_FORMAT.JSON)
            this.printJsonReport(timeline, tags, printMode);
    }

    printTextReport(timeline, tags, printMode) {
        if (!printMode || printMode === PRINT_MODES.TIMELINE)
            timeline.forEach(x => console.log(x.toString()));

        if (!printMode || printMode === PRINT_MODES.TAGS)
            tags.forEach(x => console.log(x.toString()));
    }

    printJsonReport(timeline, tags, printMode) {
        let obj = {};

        if (printMode === true || printMode === PRINT_MODES.TIMELINE)
            obj.timeline = timeline;

        if (printMode === true || printMode === PRINT_MODES.TAGS)
            obj.tags = tags;

        console.log(JSON.stringify(obj));
    }

    getTimeline(entries) {
        let timelineEntries = [];
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].stop)
                continue;

            timelineEntries.push(new TimelineEntry(entries[i], entries[i + 1]));
        }

        return timelineEntries;
    }

    getByTags(entries) {
        let byTags = {};
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].stop)
                continue;

            let { hoursDiff, minutesDiff } = this.getEntriesProps(entries, i);

            entries[i].tags.forEach(t => {
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
        let startHour = thisEntry.getMoment();
        let endHour = nextEntry ? nextEntry.getMoment() : moment();
        let hoursDiff = endHour.diff(startHour, 'hours');
        let minutesDiff = endHour.diff(startHour, 'minutes') % 60;

        return { hoursDiff, minutesDiff };
    }
}

module.exports = File;
