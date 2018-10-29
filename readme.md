# time.txt - simple, text-based time tracking app inspired by todo.txt project

## Build and install
Install via npm/yarn:
```
npm install time.txt -g
yarn global add time.txt
```

Manual build:
```
git clone https://github.com/galczo5/time.txt.git
cd time.txt
npm install
npm install -g
```

## Quick start
Add `-d` flag to set working directory. Optionally set `-h` flag to `12`, if you want to have hours in US format.

TIP: Configure everything with alias:

```
alias tt='time.txt -d ~/Dropbox/tt'
```

To start new activity execute `start` command:
```
tt start "readme.md for time.txt"
```

To stop activity you can use `stop` command:
```
tt stop
```

You don't have to manually stop every activity, you can just start another one.

Every acrivity can have multiple tags. Tags are words with started with `+` sign. **Tags are case-sensitive!**
```
tt start "open source +development, bugfixing +time.txt, +js"
```

To show raport use `show` command:
```
tt show

Example result:
16:04 - 16:06 [0h 2m] readme.md for time.txt
16:14 - 16:23 [0h 9m] open source +development, bugfixing +time.txt, +js
--
[0h 9m] +development, 
[0h 9m] +time.txt, 
[0h 9m] +js 
```

If you want to start or stop activity for date different than current hour, you can force date with `-f` flag or edit text file.
```
tt stop -f '2018-10-28 16:20'
```

## Manual
```
Usage: time.txt [options]

Options:
  -d <dir>       [required] sets working directory
  -h [12,24]     sets hour format, default 24
  -f <date>      sets date, default: today
  start <name>   starts new activity
  stop           stops current activity
  show           shows report
  -v, --version  output the version number
  -h, --help     output usage information
```

## Contribution
We welcome all contributations. Open an issue or pull request and I'll try to answer as soon as possible.
**Please make sure that your changes are usefull for all users before you post changes.**

## License
MIT, see [LICENSE](./license.org).
