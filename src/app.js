#!/usr/bin/env node

const PROGRAM_VERSION = require('../package.json').version;
const program = require('commander');
const moment = require('moment');
const File = require('./file.js');
const Entry = require('./entry.js');
const Settings = require('./settings.js');
const Report = require('./report.js');
const SESSION = require('./session.js');
const colors = require('colors');
const OUTPUT_FORMAT = require('./outputFormat.js');
const PRINT_MODES = require('./printModes.js');

program.option('--dir <dir>', '[required]'.bold + ' set working directory')
    .description('time.txt - simple, text-based time tracking app inspired by todo.txt project')
    .option('--hour-format [12,24]', 'set hour format, default 24')
    .option('--date-format <format>', 'set date format, default "YYYY-MM-DD"')
    .option('--date <date>', 'set date, default: today')
    .option('--case-insensitive-tags', 'set case insensitive tags, default: disabled')
    .version(PROGRAM_VERSION, '-v, --version');

program.command('show [timeline,tags,both]')
    .description('show report, default: both')
    .option('--output [text,json]', 'set output format, default: text')
    .option('--date-from <date>', 'set report date from')
    .option('--date-to <date>', 'set report date to')
    .option('--filter <tags>', 'set filter by tags, value can be separated with ; sign')
    .action((val, args) => {
        initGlobals();
        let r = new Report(args.dateFrom || SESSION.SETTINGS.date,
                           args.dateTo || SESSION.SETTINGS.date,
                           args.output || OUTPUT_FORMAT.TEXT,
                           PRINT_MODES.fromString(val));

        let filter = null;
        if (args.filter)
            filter = args.filter.split(';');

        r.print(filter);
    });

program.command('start <name>')
    .description('start new activity')
    .action((val, args) => {
        initGlobals();
        let f = loadFile();
        addEntryAndSave(f, new Entry({
            hour: SESSION.SETTINGS.hour,
            name: val
        }));
    });

program.command('stop')
    .description('stop current activity')
    .action((val, args) => {
        initGlobals();
        let f = loadFile();
        addEntryAndSave(f, new Entry({
            hour: SESSION.SETTINGS.hour,
            name: SESSION.STOP_SIGN
        }));
    });

program.parse(process.argv);

function initGlobals() {
    SESSION.SETTINGS = new Settings(program.dir, program.date, program.dateFormat, program.hourFormat, program.caseInsensitiveTags);
}

function loadFile() {
    let f = new File(SESSION.SETTINGS.currentFilePath);
    f.load();
    return f;
}

function addEntryAndSave(f, entry) {
    f.addEntry(entry);
    f.save();
}