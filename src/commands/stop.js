const SESSION = require('../model/session.js');

const File = require('../model/file.js');
const Entry = require('../model/entry.js');
const Settings = require('../model/settings.js');

function stop(settings) {
    SESSION.SETTINGS = getSettings(settings);
    let f = loadFile();
    addEntryAndSave(f, new Entry({
        hour: SESSION.SETTINGS.hour,
        name: SESSION.STOP_SIGN
    }));
}

function getSettings({dir, date, dateFormat, hourFormat, caseInsensitiveTags}) {
    return new Settings(dir, date, dateFormat, hourFormat, caseInsensitiveTags);
}

function loadFile() {
    let f = new File(SESSION.SETTINGS.currentFilePath);
    f.load();
    return f;
}

function addEntryAndSave(f, entry) {
    f.addEntry(entry);
    f.save();
}

module.exports = stop;