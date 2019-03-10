const SESSION = require('../model/session.js');
const PRINT_MODES = require('../model/printModes.js');
const OUTPUT_FORMAT = require('../model/outputFormat.js');

const Settings = require('../model/settings.js');
const Report = require('../model/report.js');

function show(type, dateFrom, dateTo, outputFormat, filter, settings) {
    SESSION.SETTINGS = getSettings(settings);
    let r = new Report(dateFrom || SESSION.SETTINGS.date,
                       dateTo || SESSION.SETTINGS.date,
                       outputFormat || OUTPUT_FORMAT.TEXT,
                       PRINT_MODES.fromString(type));

    let f = null;
    if (filter)
        f = filter.split(';');

    return r.generate(f);
}

function getSettings({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
}

module.exports = show;