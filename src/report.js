const moment = require('moment');
const FileUtils = require('./fileUtils.js');
const File = require('./file.js');
const colors = require('colors');
const PRINT_MODE = require('./printModes.js');
const GLOBAL = require('./globals.js');
const OUTPUT_FORMAT = require('./outputFormat.js');

class Report {
    constructor(dateFrom, dateTo, printMode = PRINT_MODE.BOTH) {
        this.printMode = printMode;
        this.dateFrom = moment(dateFrom, GLOBAL.SETTINGS.dateFormat);
        this.dateTo = moment(dateTo, GLOBAL.SETTINGS.dateFormat);
        this.files = [];
        this.getFiles();
    }

    getFiles() {
        let diff = this.dateTo.diff(this.dateFrom, 'days');
        let dir = GLOBAL.SETTINGS.directory;
        for (let i = 0; i <= diff; i++) {
            let d = moment(this.dateFrom.toDate()).add(i, 'days');
            let filePath = FileUtils.getFilePathFromDate(d.toDate(), dir);
            this.files.push({
                date: d,
                file: new File(filePath)
            });
        }
    }

    getTimeline(filter = null) {
        let result = {};
        this.files.forEach(f => {
            f.file.load();

            let key = f.date.format(GLOBAL.SETTINGS.dateFormat);
            result[key] = f.file.getTimeline()
                .filter(x => !filter || filter.some(f => x.tags.includes(f)));
        });

        return result;
    }

    getTags(filter = null) {
        let result = {};
        this.files.forEach(f => {
            f.file.load();
            let tags = f.file.getTags();

            tags.forEach(t => {
                if (filter && !filter.includes(t.tag))
                    return;

                if (t.tag in result)
                    result[t.tag].addTime(t.hours, t.minutes);
                else
                    result[t.tag] = t;
            });
        });

        return Object.values(result).filter(x => x.length !== 0);
    }

    print(filter, outputFormat) {
        let timeline = this.getTimeline(filter);
        let tags = this.getTags(filter);

        if (outputFormat === OUTPUT_FORMAT.TEXT)
            this.printTextReport(timeline, tags);

        else if (outputFormat === OUTPUT_FORMAT.JSON)
            this.printJsonReport(timeline, tags);
    }

    printTextReport(timeline, tags) {
        if (this.printMode === PRINT_MODE.TIMELINE || this.printMode === PRINT_MODE.BOTH) {

            Object.keys(timeline).forEach(key => {
                if (timeline[key].length === 0)
                    return;

                console.log(key.bold.red);

                timeline[key].forEach(x => {
                    console.log(x.toString());
                });
            });
        }

        if (this.printMode === PRINT_MODE.TAGS || this.printMode === PRINT_MODE.BOTH) {
            tags.forEach(x => {
                console.log(x.toString());
            });
        }
    }

    printJsonReport(timeline, tags) {
        let result = {};
        if (this.printMode === PRINT_MODE.TIMELINE || this.printMode === PRINT_MODE.BOTH)
            result.timeline = timeline;

        if (this.printMode === PRINT_MODE.TAGS || this.printMode === PRINT_MODE.BOTH)
            result.tags = tags;

        console.log(JSON.stringify(result));
    }
}

module.exports = Report;