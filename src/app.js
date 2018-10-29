#!/usr/bin/env node

const PROGRAM_VERSION = require('../package.json').version;
const program = require('commander');
const moment = require('moment');
const File = require('./file.js');
const Entry = require('./entry.js');
const Settings = require('./settings.js');
const GLOBAL = require('./globals.js');
const colors = require('colors');

program.option('-d <dir>', '[required]'.bold + ' sets working directory')
    .option('-h [12,24]', 'sets hour format, default 24')
    .option('-f <date>', 'sets date, default: today')
    .option('-o [text,json]', 'sets output format, default: text')
    .option('start <name>', 'starts new activity')
    .option('stop', 'stops current activity')
    .option('show', 'shows report')
    .version(PROGRAM_VERSION, '-v, --version')
    .parse(process.argv);

if (!program.start && !program.stop && !program.show) {
    program.help();
    return;
}

if (!program.D) {
    console.log('Please set working directory.');
    console.log('Execute '+ '"time.txt --help"'.bold + ' to see manual.')
    return;
}

GLOBAL.SETTINGS = new Settings(program.D, program.F, program.H, program.O);

let f = new File(GLOBAL.SETTINGS.filePath);
f.load();

if (program.start) {
    f.addEntry(new Entry({ hour: GLOBAL.SETTINGS.hour, name: program.start }));
    f.save();
}

else if (program.stop) {
    f.addEntry(new Entry({ hour: GLOBAL.SETTINGS.hour, name: GLOBAL.STOP_SIGN }));
    f.save();
}

else if (program.show) {
    f.printRaport();
}
