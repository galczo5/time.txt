const colors = require('colors');

const DateUtils = require('./dateUtils.js');
const FileUtils = require('./fileUtils.js');
const File = require('./file.js');

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

        
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
        this.files = [];

        this.loadFiles();
    }

    loadFiles() {
        let dir = SESSION.SETTINGS.directory;
        let dateRange = DateUtils.range(this.dateFrom, this.dateTo);
        for (let date of dateRange) {
            let filePath = FileUtils.getFilePathFromDate(date, dir);
            let file = new File(filePath);
            file.load();

            let formattedDate = DateUtils.format(date);
            this.files.push({ date: formattedDate, file });
        }
    }

    getTimeline(filter = null) {
        let result = {};
        for (let f of this.files) {
            let key = f.date;
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

    generate(filter) {
        let timeline = this.getTimeline(filter);
        let tags = this.getTags(filter);

        if (this.outputFormat === OUTPUT_FORMAT.TEXT)
            return this.textReport(timeline, tags);
        else if (this.outputFormat === OUTPUT_FORMAT.JSON)
            return this.jsonReport(timeline, tags);
        else
            throw 'invalid output format';
    }

    textReport(timeline, tags) {
        let result = '';

        if (this.includeTimeline) {
            for (let date in timeline) {
                let entries = timeline[date];
                if (entries.length === 0)
                    return '';

                // Print header only when report includes more than one day
                if (Object.keys(timeline).length != 1)
                    result += date + '\n';

                entries.forEach(x => result += x.toString() + '\n');
            }
        }

        if (this.includeTags)
            tags.forEach(x => result += x.toString() + '\n');

        return result;
    }

    jsonReport(timeline, tags) {
        let result = {};
        if (this.includeTimeline)
            result.timeline = timeline;

        if (this.includeTags)
            result.tags = tags;

        return JSON.stringify(result, null, 2);
    }
}

module.exports = Report;