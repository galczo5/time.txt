const SESSION = require('./session.js');

class Entry {
    constructor({
        hour = null,
        name = '',
        stop = null
    } = {}) {
        this.hour = hour;
        this.name = stop ? SESSION.STOP_SIGN : name;
        this.tags = [];
        this.processTags();
        this.stop = stop || name.includes(SESSION.STOP_SIGN);
    }

    processTags() {
        let chunks = this.name.split(' ');
        this.tags = chunks.filter(c => c.startsWith('+'));
    }

    fromString(str, settings) {
        let chunks = str.split(' ');
        this.hour =  chunks[0];
        this.name = chunks.slice(1, chunks.length).join(' ');

        if (this.name.includes(SESSION.STOP_SIGN))
            this.stop = true;

        this.processTags();
    }

    toString(settings) {
        return this.hour + ' ' + this.name;
    }
}

module.exports = Entry;
