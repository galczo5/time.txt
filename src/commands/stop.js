const GLOBAL = require('../model/global.js');

const File = require('../model/file.js');
const FileUtils = require('../utils/fileUtils.js');
const Settings = require('../model/settings.js');

// TODO: change signature to: (date, [config])
function stop(config) {
    GLOBAL.settings = Settings.fromRaw(config);
    let f = loadFile();
    f.addEntry(GLOBAL.settings.getHour(), GLOBAL.settings.stopSign);
    f.save();
}

function loadFile() {
    let filePath = FileUtils.getFilePathFromDate(GLOBAL.settings.date, GLOBAL.settings.directory);;
    let f = new File(filePath);
    f.load();
    return f;
}

module.exports = stop;