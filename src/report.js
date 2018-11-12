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

    getTimeline() {
        let result = {};
        this.files.forEach(f => {
            f.file.load();
            result[f.date.format(GLOBAL.SETTINGS.dateFormat)] = f.file.getTimeline();
        });

        return result;
    }

    getTags() {
        let result = {};
        this.files.forEach(f => {
            f.file.load();
            let tags = f.file.getTags();

            tags.forEach(t => {
                if (t.tag in result)
                    result[t.tag].addTime(t.hours, t.minutes);
                else
                    result[t.tag] = t;
            });
        });

        return Object.values(result);
    }

    print() {
        if (GLOBAL.SETTINGS.outputFormat === OUTPUT_FORMAT.TEXT)
            this.printTextReport();

        else if (GLOBAL.SETTINGS.outputFormat === OUTPUT_FORMAT.JSON)
            this.printJsonReport();
    }

    printTextReport() {
        if (this.printMode === PRINT_MODE.TIMELINE || this.printMode === PRINT_MODE.BOTH) {
            let timeline = this.getTimeline();
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
            let tags = this.getTags().filter(x => x.length !== 0);
            tags.forEach(x => {
                console.log(x.toString());
            });
        }
    }

    printJsonReport() {
        let result = {};
        if (this.printMode === PRINT_MODE.TIMELINE || this.printMode === PRINT_MODE.BOTH) {
            result.timeline = this.getTimeline();
        }

        if (this.printMode === PRINT_MODE.TAGS || this.printMode === PRINT_MODE.BOTH) {
            result.tags = this.getTags().filter(x => x.length !== 0);
        }

        console.log(JSON.stringify(result));
    }
}

module.exports = Report;