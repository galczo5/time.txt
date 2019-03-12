const VALUES = require('../utils/values.js');

const File = require('../model/file.js');
const FileUtils = require('../utils/fileUtils.js');
const Settings = require('../model/settings.js');

// TODO: change signature to: (date, [config])
function stop(config) {
    let settings = Settings.fromRaw(config);
    let f = loadFile(settings);
    f.addEntry(settings.getHour(), VALUES.stopSign);
    f.save();
}

function loadFile(settings) {
    let filePath = FileUtils.getFilePathFromDate(settings.date, settings.directory);
    let f = new File(filePath);
    f.load();
    return f;
}

module.exports = stop;