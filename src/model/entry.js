const GLOBAL = require('./global.js');

class Entry {
    constructor(hour, name, stop = null) {
        this.hour = hour;
        this.name = name;
        this.tags = [];
        this.processTags();
        this.stop = stop || name.includes(GLOBAL.settings.stopSign);
    }

    static fromString(str) {
        let chunks = str.split(' ');
        let hour =  chunks[0];
        let name = chunks.slice(1, chunks.length).join(' ');
        return new Entry(hour, name);
    }

    processTags() {
        let chunks = this.name.split(' ');
        this.tags = chunks.filter(c => c.startsWith('+'));
    }

    toString() {
        return this.hour + ' ' + this.name;
    }
}

module.exports = Entry;
