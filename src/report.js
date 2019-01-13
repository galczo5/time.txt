const moment = require('moment');
const FileUtils = require('./fileUtils.js');
const File = require('./file.js');
const colors = require('colors');
const PRINT_MODES = require('./printModes.js');
const SESSION = require('./session.js');
const OUTPUT_FORMAT = require('./outputFormat.js');

function matchTags(filter, tags) {
    if (SESSION.SETTINGS.caseInsensitiveTags) {
        tags = tags.map(x => x.toUpperCase());
        filter = filter.map(x => x.toUpperCase());
    }

    return tags.some(t => filter.includes(t));
}

class Report {
    constructor(dateFrom, dateTo, outputFormat = OUTPUT_FORMAT.TEXT, printMode = PRINT_MODES.BOTH) {
        this.outputFormat = outputFormat;
        this.includeTimeline = PRINT_MODES.timelineActive(printMode);
        this.includeTags = PRINT_MODES.tagsActive(printMode);

        this.dateFrom = moment(dateFrom, SESSION.SETTINGS.dateFormat);
        this.dateTo = moment(dateTo, SESSION.SETTINGS.dateFormat);
        this.files = [];

        this.loadFiles();
    }

    loadFiles() {
        let diff = this.dateTo.diff(this.dateFrom, 'days');
        let dir = SESSION.SETTINGS.directory;
        for (let i = 0; i <= diff; i++) {
            let date = moment(this.dateFrom.toDate()).add(i, 'days');
            let filePath = FileUtils.getFilePathFromDate(date.toDate(), dir);
            let file = new File(filePath);

            file.load();
            this.files.push({ date, file });
        }
    }

    getTimeline(filter = null) {
        let result = {};
        for (let f of this.files) {
            let key = f.date.format(SESSION.SETTINGS.dateFormat);
            result[key] = f.file.getTimeline(filter)
                .filter(x => !filter || matchTags(filter, x.tags));
        }

        return result;
    }

    getTags(filter = null) {
        let result = {};
        for (let f of this.files) {
            let tags = f.file.getTags(filter);
            tags.forEach(t => {
                if (filter && !matchTags(filter, [t.tag]))
                    return;

                if (t.tag in result)
                    result[t.tag].addTime(t.hours, t.minutes);
                else
                    result[t.tag] = t;
            });
        }

        return Object.values(result).filter(x => x.length !== 0);
    }

    print(filter) {
        let timeline = this.getTimeline(filter);
        let tags = this.getTags(filter);

        if (this.outputFormat === OUTPUT_FORMAT.TEXT)
            this.printTextReport(timeline, tags);
        else if (this.outputFormat === OUTPUT_FORMAT.JSON)
            this.printJsonReport(timeline, tags);
        else
            throw 'invalid output format';
    }

    printTextReport(timeline, tags) {
        if (this.includeTimeline) {
            for (let date in timeline) {
                let entries = timeline[date];
                if (entries.length === 0)
                    return;

                console.log(date.bold.red);
                entries.forEach(x => x.print());
            }
        }

        if (this.includeTags)
            tags.forEach(x => x.print());
    }

    printJsonReport(timeline, tags) {
        let result = {};
        if (this.includeTimeline)
            result.timeline = timeline;

        if (this.includeTags)
            result.tags = tags;

        const stringResult = JSON.stringify(result, null, 2);
        console.log(stringResult);
    }
}

module.exports = Report;