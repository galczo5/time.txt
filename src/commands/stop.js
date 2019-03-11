const GLOBAL = require('../model/global.js');

const File = require('../model/file.js');
const Settings = require('../model/settings.js');

function stop(settings) {
    GLOBAL.settings = getSettings(settings);
    let f = loadFile();
    f.addEntry(GLOBAL.settings.getHour(), GLOBAL.settings.stopSign);
    f.save();
}

function getSettings({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
}

function loadFile() {
    let f = new File(GLOBAL.settings.currentFilePath);
    f.load();
    return f;
}

module.exports = stop;