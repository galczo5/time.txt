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
        directory: dir.path,
        date: testDateFrom,
        dateFormat: 'YYYY-MM-DD'
    };
}

function prepareArgs() {
    return {
        type: 'tags',
        dateFrom: testDateFrom,
        dateTo: testDateTo,
        filter: null
    };
}

describe('timetxt [options] show tags', () => {
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
        return;
    });

    it('should display empty object report when file does not exist', () => {
        return;
    });

    it('should display empty text report when file is empty', () => {
        return;
    });

    it('should display empty object when file is empty', () => {
        return;
    });

    it('should display text report for date', () => {
        return;
    });

    it('should display text report for date range', () => {
        return;
    });

    it('should display json report for date', () => {
        return;
    });

    it('should display json report for date range', () => {
        return;
    });

    it('should not display header when report contains single day data', () => {
        return;
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
