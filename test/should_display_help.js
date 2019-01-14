const should = require('chai').should();
const exec = require('child_process').exec;
const fs = require('fs');

const utils = require('./utils.js');

describe('timetxt --help', () => {
    it('should display help', async () => {
        let result = await utils.sh('timetxt --help');
        result.stdout.should.include('time.txt - simple, text-based time tracking app inspired by todo.txt project');
        result.stdout.should.include('--dir');
        result.stdout.should.include('--hour-format');
        result.stdout.should.include('--date-format');
        result.stdout.should.include('--date <date>');
        result.stdout.should.include('--case-insensitive-tags');
        getOptionCount(result.stdout).should.equal(7);
    });
});

describe('timetxt [command] --help', () => {
    it('should display "start" command help', async () => {
        let result = await utils.sh('timetxt start --help');
        result.stdout.should.include('start new activity');
        getOptionCount(result.stdout).should.equal(1);
    });

    it('should display "stop" command help', async () => {
        let result =  await utils.sh('timetxt stop --help');
        result.stdout.should.include('stop current activity');
        getOptionCount(result.stdout).should.equal(1);
    });

    it('should display "show" command help', async () => {
        let result = await utils.sh('timetxt show --help');
        result.stdout.should.include('show report, default: timeline');
        result.stdout.should.include('--output');
        result.stdout.should.include('--date-from');
        result.stdout.should.include('--date-to');
        result.stdout.should.include('--filter');
        result.stdout.should.include('--no-color');
        getOptionCount(result.stdout).should.equal(6);
    });
});

function getOptionCount(stdout) {
    return stdout.split(' ').filter(x => x.startsWith('--')).length;
}