const should = require('chai').should();
const {help} = require('../src/app.js');

describe('timetxt --help', () => {
    it('should display help', () => {
        let result = help();
        result.should.include('time.txt - simple, text-based time tracking app inspired by todo.txt project');
        result.should.include('--dir');
        result.should.include('--hour-format');
        result.should.include('--date-format');
        result.should.include('--date <date>');
        result.should.include('--case-insensitive-tags');
        getOptionCount(result).should.equal(7);
    });
});

describe('timetxt [command] --help', () => {
    it('should display "start" command help', () => {
        let result = help('start');
        result.should.include('start new activity');
        getOptionCount(result).should.equal(1);
    });

    it('should display "stop" command help', () => {
        let result = help('stop');
        result.should.include('stop current activity');
        getOptionCount(result).should.equal(1);
    });

    it('should display "show" command help', () => {
        let result = help('show');
        result.should.include('show report, default: timeline');
        result.should.include('--output');
        result.should.include('--date-from');
        result.should.include('--date-to');
        result.should.include('--filter');
        result.should.include('--no-color');
        getOptionCount(result).should.equal(6);
    });
});

function getOptionCount(stdout) {
    return stdout.split(' ').filter(x => x.startsWith('--')).length;
}