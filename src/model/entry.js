const GLOBAL = require('./global.js');
const Settings = require('./settings.js');

class Entry {
    constructor({
        hour = null,
        name = '',
        stop = null
    } = {}) {
        this.hour = hour;
        this.name = stop ? GLOBAL.settings.stopSign : name;
        this.tags = [];
        this.processTags();
        this.stop = stop || name.includes(GLOBAL.settings.stopSign);
    }

    processTags() {
        let chunks = this.name.split(' ');
        this.tags = chunks.filter(c => c.startsWith('+'));
    }

    fromString(str, settings) {
        let chunks = str.split(' ');
        this.hour =  chunks[0];
        this.name = chunks.slice(1, chunks.length).join(' ');

        if (this.name.includes(GLOBAL.settings.stopSign))
            this.stop = true;

        this.processTags();
    }

    toString(settings) {
        return this.hour + ' ' + this.name;
    }
}

module.exports = Entry;
