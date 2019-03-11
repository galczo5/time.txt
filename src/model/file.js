const fs = require('fs');
const colors = require('colors');
const FileEntry = require('./fileEntry.js');

class File {
    constructor(filePath) {
        this.filePath = filePath;
        this.entries = [];
    }

    addEntry(hour, name) {
        this.entries.push(new FileEntry(hour, name));
        this.sortEntries();
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            let fileText = fs.readFileSync(this.filePath, 'utf8');
            this.entries = fileText
                .split('\n')
                .filter(e => e.length != 0)
                .map(e => FileEntry.fromString(e));
        }

        this.sortEntries();
    }

    save() {
        fs.writeFileSync(this.filePath, this.toString());
    }

    sortEntries() {
        this.entries.sort((a, b) => a.hour.localeCompare(b.hour));
    }

    toString() {
        return this.entries.map(e => e.toString()).join('\n');;
    }
}

module.exports = File;
