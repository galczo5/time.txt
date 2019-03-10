const GLOBAL = require('../model/global.js');

const File = require('../model/file.js');
const Entry = require('../model/entry.js');
const Settings = require('../model/settings.js');

function stop(settings) {
    GLOBAL.settings = getSettings(settings);
    let f = loadFile();
    addEntryAndSave(f, new Entry({
        hour: GLOBAL.settings.getHour(),
        name: GLOBAL.settings.stopSign
    }));
}

function getSettings({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
}

function loadFile() {
    let f = new File(GLOBAL.settings.currentFilePath);
    f.load();
    return f;
}

function addEntryAndSave(f, entry) {
    f.addEntry(entry);
    f.save();
}

module.exports = stop;