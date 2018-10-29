class ByTagDifference {
    constructor(tag, h, m) {
        this.tag = tag;
        this.hours = h;
        this.minutes = m;
    }

    addTime(h, m) {
        this.hours += h;
        this.minutes += m;

        if (this.minutes > 60) {
            this.hours++;
            this.minutes %= 60;
        }
    }

    toString() {
        return `[${this.hours}h ${this.minutes}m] ${this.tag.bold.red}`;
    }
}

module.exports = ByTagDifference;