const GLOBAL = require('../model/global.js');

const File = require('../model/file.js');
const FileUtils = require('../utils/fileUtils.js');
const Settings = require('../model/settings.js');

// TODO: Change start signature to: (date, name, [config])
function start(name, config) {
    GLOBAL.settings = Settings.fromRaw(config);
    let f = loadFile();
    f.addEntry(GLOBAL.settings.getHour(), name);
    f.save();
}

function loadFile() {
    let filePath = FileUtils.getFilePathFromDate(GLOBAL.settings.date, GLOBAL.settings.directory);
    let f = new File(filePath);
    f.load();
    return f;
}

module.exports = start;