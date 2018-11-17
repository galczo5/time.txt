const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require('rimraf');

function sh(command) {
    return new Promise(resolve => {
        exec(command, (error, stdout, stderr) => {
            resolve({error, stdout, stderr});
        });
    });
}

function randomDir() {
    let path = __dirname + '/tmp/' + Math.random().toString(36).substring(8) + '/';

    return {
        path,
        create() {
            if (fs.existsSync(path))
                throw `directory ${path} already exists`;

            fs.mkdirSync(path);
        },
        remove() { rimraf.sync(path); }
    };
}

function commandBuilder() {
    let options = {};

    this.dir = dir => {
        options['--dir'] = dir;
        return this;
    };

    this.date = date => {
        options['--date'] = '"' + date + '"';
        return this;
    };

    this.dateFormat = dateFormat => {
        options['--date-format'] = dateFormat;
        return this;
    };

    this.hourFormat = hourFormat => {
        options['--hour-format'] = hourFormat;
        return this;
    };

    this.caseInsensitiveTags = () => {
        options['--case-insensitive-tags'] = '';
        return this;
    };

    this.help = () => {
        options['--help'] = '';
        return this;
    };

    this.start = (x) => {
        return `timetxt ${optionsToString(options)} start "${x}"`;
    };

    this.stop = () => {
        return `timetxt ${optionsToString(options)} stop`;
    };

    this.show = (x) => {
        return `timetxt ${optionsToString(options)} show ${x}`;
    };

    this.none = () => {
        return `timetxt ${optionsToString(options)}`;
    };

    return this;
}

function optionsToString(options) {
    return Object.keys(options)
        .reduce((x, y) => [x, y, options[y]].join(' '), '');
}

module.exports = {
    sh,
    commandBuilder,
    randomDir
};