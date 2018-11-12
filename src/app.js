#!/usr/bin/env node

const PROGRAM_VERSION = require('../package.json').version;
const program = require('commander');
const moment = require('moment');
const File = require('./file.js');
const Entry = require('./entry.js');
const Settings = require('./settings.js');
const Report = require('./report.js');
const GLOBAL = require('./globals.js');
const colors = require('colors');
const OUTPUT_FORMAT = require('./outputFormat.js');
const PRINT_MODES = require('./printModes.js');

program.option('--dir <dir>', '[required]'.bold + ' set working directory')
    .description('time.txt - simple, text-based time tracking app inspired by todo.txt project')
    .option('--hour-format [12,24]', 'set hour format, default 24')
    .option('--date-format <format>', 'set date format, default "YYYY-MM-DD"')
    .option('--date <date>', 'set date, default: today')
    .version(PROGRAM_VERSION, '-v, --version');

program.command('show [timeline,tags]')
    .description('show report, default: both')
    .option('--output [text,json]', 'set output format, default: text')
    .option('--date-from <date>', 'set date from')
    .option('--date-to <date>', 'set date to')
    .action((val, args) => {
        initGlobals();
        GLOBAL.SETTINGS.outputFormat = args.output || GLOBAL.SETTINGS.outputFormat;

        let r = new Report(args.dateFrom, args.dateTo, PRINT_MODES.fromString(val));
        r.print();
    });

program.command('start <name>')
    .description('start new activity')
    .action((val, args) => {
        initGlobals();
        let f = loadFile();
        addEntryAndSave(f, new Entry({
            hour: GLOBAL.SETTINGS.hour,
            name: val
        }));
    });

program.command('stop')
    .description('stop current activity')
    .action((val, args) => {
        initGlobals();
        let f = loadFile();
        addEntryAndSave(f, new Entry({
            hour: GLOBAL.SETTINGS.hour,
            name: GLOBAL.STOP_SIGN
        }));
    });

program.parse(process.argv);

function initGlobals() {
    GLOBAL.SETTINGS = new Settings(program.dir, program.date, program.dateFormat, program.hourFormat);
}

function loadFile() {
    let f = new File(GLOBAL.SETTINGS.filePath);
    f.load();
    return f;
}

function addEntryAndSave(f, entry) {
    f.addEntry(entry);
    f.save();
}