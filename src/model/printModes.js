let PRINT_MODES = {
    TIMELINE: 'timeline',
    TAGS: 'tags'
};

module.exports = {
    ...PRINT_MODES,

    fromString(str) {
        if (!str)
            return PRINT_MODES.TIMELINE;

        str = str.toLowerCase();
        if (str === PRINT_MODES.TIMELINE)
            return PRINT_MODES.TIMELINE;
        else if (str === PRINT_MODES.TAGS)
            return PRINT_MODES.TAGS;

        return null;
    }
};