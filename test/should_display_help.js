var assert = require('assert');
var exec = require('child_process').exec;

describe('timetxt --help', () => {
    it('should display help', (done) => {
        exec('timetxt --help', (error, stdout, stderr) => {
            let desciption = "time.txt - simple, text-based time tracking app inspired by todo.txt project";
            assert(stdout.includes(desciption));
            assert(stdout.includes('--dir'));
            assert(stdout.includes('--hour-format'));
            assert(stdout.includes('--date-format'));
            assert(stdout.includes('--date <date>'));
            assert(stdout.includes('--case-insensitive-tags'));
            assert.equal(getOptionCount(stdout), 7);
            done();
        });
    });
});

describe('timetxt [command] --help', () => {
    it('should display "start" command help', (done) => {
        exec('timetxt start --help', (error, stdout, stderr) => {
            let description = "start new activity";
            assert(stdout.includes(description));
            assert.equal(getOptionCount(stdout), 1);
            done();
        });
    });

    it('should display "stop" command help', (done) => {
        exec('timetxt stop --help', (error, stdout, stderr) => {
            let description = "stop current activity";
            assert(stdout.includes(description));
            assert.equal(getOptionCount(stdout), 1);
            done();
        });
    });

    it('should display "show" command help', (done) => {
        exec('timetxt show --help', (error, stdout, stderr) => {
            let description = "show report, default: both";
            assert(stdout.includes(description));
            assert(stdout.includes('--output'));
            assert(stdout.includes('--date-from'));
            assert(stdout.includes('--date-to'));
            assert(stdout.includes('--filter'));
            assert.equal(getOptionCount(stdout), 5);

            done();
        });
    });
});

function getOptionCount(stdout) {
    return stdout.split(' ').filter(x => x.startsWith('--')).length;
}