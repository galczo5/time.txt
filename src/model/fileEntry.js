const VALUES = require('../utils/values.js');

class FileEntry {
    constructor(hour, name, stop = null) {
        this.hour = hour;
        this.name = name;
        
        this.tags = this.name
            .split(' ')
            .filter(c => c.startsWith('+'));

        this.stop = stop || name.includes(VALUES.stopSign);
    }

    static fromString(str) {
        let chunks = str.split(' ');
        let hour =  chunks[0];
        let name = chunks.slice(1, chunks.length).join(' ');
        return new FileEntry(hour, name);
    }

    toString() {
        return this.hour + ' ' + this.name;
    }
}

module.exports = FileEntry;
