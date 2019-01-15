const fs = require('fs');
const rimraf = require('rimraf');

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

module.exports = {
    randomDir
};