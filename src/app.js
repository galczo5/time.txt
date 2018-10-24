#!/usr/bin/env node

const program = require('commander');
const moment = require('moment');
const File = require('./file.js');
const Entry = require('./entry.js');
const Settings = require('./settings.js');
const GLOBAL = require('./globals.js');

program.version('0.0.1')
       .option('-d <dir>', 'set working directory')
       .option('-h [12,24]', 'sets hour format, default 24')
       .option('-f <date>', 'sets date, default: today')
       .option('start <name>', 'starts new activity')
       .option('stop', 'stops current activity')
       .option('show', 'shows report')
       .parse(process.argv);

GLOBAL.SETTINGS = new Settings(program.D, program.F, program.H);

if (!program.start && !program.stop && !program.show)
    return;

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
