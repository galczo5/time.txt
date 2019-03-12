const File = require('../model/file.js');
const FileUtils = require('../utils/fileUtils.js');
const Settings = require('../model/settings.js');

// TODO: Change start signature to: (date, name, [config])
function start(name, config) {
    let settings = Settings.fromRaw(config);
    let f = loadFile(settings);
    f.addEntry(settings.getHour(), name);
    f.save();
}

function loadFile(settings) {
    let filePath = FileUtils.getFilePathFromDate(settings.date, settings.directory);
    let f = new File(filePath);
    f.load();
    return f;
}

module.exports = start;