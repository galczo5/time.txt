const should = require('chai').should();
const expect = require('chai').expect;
const fs = require('fs');
const utils = require('./utils.js');

const {show} = require('../src/app.js');

const testActivityText = 'test activity';
const testDateFrom = '2018-11-17';
const testDateTo = '2018-11-18';
const testHour = '13:15';
const testFileName = '20181117.txt';

function getPreparedSettings(dir) {
    return {
        dir: dir.path,
        date: testDateFrom,
        dateFormat: 'YYYY-MM-DD'
    };
}

function prepareArgs() {
    return {
        type: 'timeline',
        dateFrom: testDateFrom,
        dateTo: testDateTo,
        filter: null
    };
}

describe('timetxt [options] show timeline', () => {
    let dir = null;
    let args = null;
    let settings = null;

    beforeEach(() => {
        dir = utils.randomDir();
        dir.create();

        settings = getPreparedSettings(dir);
        args = prepareArgs();
    });

    it('should display empty text report when file does not exist', () => {
        let report = show(args.type, null, null, 'text', null, settings);
        report.length.should.equal(0);
    });

    it('should display empty object report when file does not exist', () => {
        let report = show(args.type, null, null, 'json', null, settings);
        let reportObj = JSON.parse(report);
        expect(reportObj).to.deep.equal({
            timeline: {
                "2018-11-17": []
            }
        });
    });

    it('should display empty text report when file is empty', () => {
        fs.writeFileSync(dir.path + testFileName, '');
        let report = show(args.type, null, null, 'text', null, settings);
        report.length.should.equal(0);
    });

    it('should display empty object when file is empty', () => {
        fs.writeFileSync(dir.path + testFileName, '');

        let report = show(args.type, null, null, 'json', null, settings);
        let reportObj = JSON.parse(report);
        expect(reportObj).to.deep.equal({
            timeline: {
                "2018-11-17": []
            }
        });
    });

    it('should display text report for date', () => {
        let fileContent =
            '21:18 Testing time.txt app +tests\n'+
            '21:18 ---STOP---';

        fs.writeFileSync(dir.path + testFileName, fileContent);
        let report = show(args.type, null, null, 'text', null, settings);
        report.should.equal('21:18 - 21:18  [0h 0m]   Testing time.txt app +tests\n');
    });

    it('should display text report for date range', () => {
        return;
    });

    it('should display json report for date', () => {
        let fileContent =
            '21:18 Testing time.txt app +tests\n'+
            '21:18 ---STOP---';

        fs.writeFileSync(dir.path + testFileName, fileContent);
        let report = show(args.type, null, null, 'json', null, settings);
        let reportObj = JSON.parse(report);
        expect(reportObj).to.deep.equal({
            timeline: {
                "2018-11-17": [{
                    name: "Testing time.txt app +tests",
                    tags: ["+tests"],
                    hourFrom: "21:18",
                    hourTo: "21:18",
                    hoursDiff: 0,
                    minutesDiff: 0
                }]
            }
        });
    });

    it('should display json report for date range', () => {
        return;
    });

    it('should not display header when report contains single day data', () => {
        let fileContent =
            '21:18 Testing time.txt app +tests\n'+
            '21:18 ---STOP---';

        fs.writeFileSync(dir.path + testFileName, fileContent);
        let report = show(args.type, null, null, 'text', null, settings);
        report.should.not.includes(testDateFrom);
    });

    it('should display header when report contains date range data', () => {
        return;
    });

    it('should apply filter', () => {
        return;
    });

    it('should not apply filter when value is null', () => {
        return;
    });

    it('should not apply filter when value is empty string', () => {
        return;
    });
});
