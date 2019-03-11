const GLOBAL = require('../model/global.js');
const OUTPUT_FORMAT = require('../model/outputFormat.js');

const Report = require('../model/report.js');
const Settings = require('../model/settings.js');

// TODO: change signature to: (type, dateFrom, dateTo, outputFormat, filter, [config])
function show(type, dateFrom, dateTo, outputFormat, filter, config) {
    GLOBAL.settings = Settings.fromRaw(config);
    let r = new Report(dateFrom || GLOBAL.settings.date,
                       dateTo || GLOBAL.settings.date,
                       outputFormat || OUTPUT_FORMAT.TEXT,
                       type);

    let f = null;
    if (filter)
        f = filter.split(';');

    return r.generate(f);
}

module.exports = show;