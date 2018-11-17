const should = require('chai').should();
const exec = require('child_process').exec;
const fs = require('fs');
const utils = require('./utils.js');

const testActivityText = 'test activity';
const testDate = '2018-11-17 13:15';
const testHour = '13:15';
const testFileName = '20181117.txt';

function getPreparedCommand(dir) {
    return utils.commandBuilder()
        .dir(dir.path)
        .date(testDate);
}

describe('timetxt [options] start <name>', () => {
    it('should create file', async () => {
        const dir = utils.randomDir();
        dir.create();

        let command = getPreparedCommand(dir).start(testActivityText);

        await utils.sh(command);

        let fileExists = fs.existsSync(dir.path + testFileName);
        fileExists.should.equal(true);
        dir.remove();
    });

    it('should create entry in file', async () => {
        const dir = utils.randomDir();
        dir.create();

        let command = getPreparedCommand(dir).start(testActivityText);

        await utils.sh(command);
        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(testHour);
        file.should.include(testActivityText);
        file.split('\n').length.should.equal(1);
        dir.remove();
    });

    it('should add new entry to existing file', async () => {
        const dir = utils.randomDir();
        const oldActivity = '10:10 old activity name';

        dir.create();
        fs.writeFileSync(dir.path + testFileName, oldActivity);

        let command = getPreparedCommand(dir).start(testActivityText);

        await utils.sh(command);
        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(oldActivity);
        file.should.include(testHour);
        file.should.include(testActivityText);
        file.indexOf(oldActivity).should.be.below(file.indexOf(testHour));
        file.split('\n').length.should.equal(2);
        dir.remove();
    });

    it('should add new entry to existing file between old entries', async () => {
        const dir = utils.randomDir();
        const oldActivity = '10:10 old activity name';
        const newerActivity = '15:10 newer activity name';

        dir.create();
        fs.writeFileSync(dir.path + testFileName, oldActivity + '\n' + newerActivity);

        let command = getPreparedCommand(dir).start(testActivityText);

        await utils.sh(command);
        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include(oldActivity);
        file.should.include(testHour);
        file.should.include(testActivityText);
        file.indexOf(oldActivity).should.be.below(file.indexOf(testHour));
        file.indexOf(testHour).should.be.below(file.indexOf(newerActivity));
        file.split('\n').length.should.equal(3);
        dir.remove();
    });

    it('should use "12" hour format option', async () => {
        const dir = utils.randomDir();
        dir.create();

        let command = getPreparedCommand(dir)
            .hourFormat(12)
            .start(testActivityText);

        await utils.sh(command);
        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include('01:15PM');
        dir.remove();
    });

    it('should use "24" hour format option', async () => {
        const dir = utils.randomDir();
        dir.create();

        let command = getPreparedCommand(dir)
            .hourFormat(24)
            .start(testActivityText);

        await utils.sh(command);
        let file = fs.readFileSync(dir.path + testFileName, 'utf8');
        file.should.include('13:15');
        dir.remove();
    });
});