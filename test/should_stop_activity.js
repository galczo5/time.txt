const should = require('chai').should();
const exec = require('child_process').exec;
const fs = require('fs');
const utils = require('./utils.js');

const {stop} = require('../src/app.js');

const testDate = '2018-11-17 13:15';
const testHour = '13:15';
const testFileName = '20181117.txt';
const stopSign = '---STOP---';

function getPreparedSettings(dir) {
    return {
        dir: dir.path,
        date: testDate
    };
}

describe('timetxt [options] stop', () => {
    let dir = null;
    let settings = null;

    beforeEach(() => {
        dir = utils.randomDir();
        dir.create();

        settings = getPreparedSettings(dir);
    });

    afterEach(() => {
        dir.remove();
    });

    it('should create file', async () => {
        stop(settings);

        let fileExists = fs.existsSync(dir.path + testFileName);
        fileExists.should.equal(true);
    });

    it('should create entry in file', async () => {
        stop(settings);

        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(testHour);
        file.should.include(stopSign);
        file.split('\n').length.should.equal(1);
    });

    it('should add new entry to existing file', async () => {
        const oldActivity = '10:10 old activity name';
        fs.writeFileSync(dir.path + testFileName, oldActivity);

        stop(settings);

        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(oldActivity);
        file.should.include(testHour);
        file.should.include(stopSign);
        file.indexOf(oldActivity).should.be.below(file.indexOf(testHour));
        file.split('\n').length.should.equal(2);
    });

    it('should add new entry to existing file between old entries', async () => {
        const oldActivity = '10:10 old activity name';
        const newerActivity = '15:10 newer activity name';
        fs.writeFileSync(dir.path + testFileName, oldActivity + '\n' + newerActivity);

        stop(settings);

        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(oldActivity);
        file.should.include(testHour);
        file.should.include(stopSign);
        file.indexOf(oldActivity).should.be.below(file.indexOf(testHour));
        file.indexOf(testHour).should.be.below(file.indexOf(newerActivity));
        file.split('\n').length.should.equal(3);
    });

    it('should use "12" hour format option', async () => {
        stop({...settings, hourFormat: 12});

        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include('01:15PM');
    });

    it('should use "24" hour format option', async () => {
        stop({...settings, hourFormat: 24});

        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include('13:15');
    });
});