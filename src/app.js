#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const PROGRAM_VERSION = require('../package.json').version;
const OUTPUT_FORMAT = require('./outputFormat.js');
const PRINT_MODES = require('./printModes.js');

const File = require('./file.js');
const Entry = require('./entry.js');
const Settings = require('./settings.js');
const Report = require('./report.js');
const SESSION = require('./session.js');

program.option('--dir <dir>', '[required]'.bold + ' set working directory')
    .description('time.txt - simple, text-based time tracking app inspired by todo.txt project')
    .option('--hour-format [12,24]', 'set hour format, default 24')
    .option('--date-format <format>', 'set date format, default "YYYY-MM-DD"')
    .option('--date <date>', 'set date, default: today')
    .option('--case-insensitive-tags', 'set case insensitive tags, default: disabled')
    .version(PROGRAM_VERSION, '-v, --version');

program.command('show [timeline,tags,both]')
    .description('show report, default: timeline')
    .option('--output [text,json]', 'set output format, default: text')
    .option('--date-from <date>', 'set report date from')
    .option('--date-to <date>', 'set report date to')
    .option('--filter <tags>', 'set filter by tags, value can be separated with ; sign')
    .option('--no-color', 'disable colors')
    .action((val, args) => {
        show(val, args.dateFormat, args.dateTo, args.output, args.filter, program);
    });

program.command('start <name>')
    .description('start new activity')
    .action((val, args) => start(val, program));

program.command('stop')
    .description('stop current activity')
    .action((val, args) => stop(program));

program.parse(process.argv);

function show(type, dateFrom, dateTo, outputFormat, filter, settings) {
    SESSION.SETTINGS = getSettings(settings);
    let r = new Report(dateFrom || SESSION.SETTINGS.date,
                       dateTo || SESSION.SETTINGS.date,
                       outputFormat || OUTPUT_FORMAT.TEXT,
                       PRINT_MODES.fromString(type));

    let f = null;
    if (filter)
        f = filter.split(';');

    r.print(f);
}

function start(name, settings) {
    SESSION.SETTINGS = getSettings(settings);
    let f = loadFile();
    addEntryAndSave(f, new Entry({
        hour: SESSION.SETTINGS.hour,
        name: name
    }));
}

function stop(settings) {
    SESSION.SETTINGS = getSettings(settings);
    let f = loadFile();
    addEntryAndSave(f, new Entry({
        hour: SESSION.SETTINGS.hour,
        name: SESSION.STOP_SIGN
    }));
}

function help(commandName) {
    if (!commandName)
        return program.helpInformation();

    let command = program.commands.find(c => c._name === commandName);

    if (command)
        return command.helpInformation();

    return null;
}

function getSettings({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
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

module.exports = {
    show,
    start,
    stop,
    help
};