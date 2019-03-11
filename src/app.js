#!/usr/bin/env node

const program = require('commander');
const colors = require('colors');

const PROGRAM_VERSION = require('../package.json').version;

const Settings = require('./model/settings.js');
const start = require('./commands/start.js');
const stop = require('./commands/stop.js');
const show = require('./commands/show.js');

function prepareConfig({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
}

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
        let report = show(val, args.dateFormat, args.dateTo, args.output, args.filter, prepareConfig(program));
        console.log(report);
    });

program.command('start <name>')
    .description('start new activity')
    .action((val, args) => start(val, prepareConfig(program)));

program.command('stop')
    .description('stop current activity')
    .action((val, args) => stop(prepareConfig(program)));

program.parse(process.argv);

function help(commandName) {
    if (!commandName)
        return program.helpInformation();

    let command = program.commands.find(c => c._name === commandName);

    if (command)
        return command.helpInformation();

    return null;
}

module.exports = {
    show,
    start,
    stop,
    help
};