let PRINT_MODES = {
    TIMELINE: 'timeline',
    TAGS: 'tags',
    BOTH: 'both'
};

module.exports = {
    ...PRINT_MODES,

    timelineActive(printMode) {
        return printMode === PRINT_MODES.TIMELINE || printMode === PRINT_MODES.BOTH;
    },

    tagsActive(printMode) {
        return printMode === PRINT_MODES.TAGS || printMode === PRINT_MODES.BOTH;
    },

    fromString(str) {
        if (!str)
            return PRINT_MODES.TIMELINE;

        str = str.toLowerCase();
        if (str === PRINT_MODES.TIMELINE)
            return PRINT_MODES.TIMELINE;
        else if (str === PRINT_MODES.TAGS)
            return PRINT_MODES.TAGS;
        else if (str === PRINT_MODES.BOTH)
            return PRINT_MODES.BOTH;

        return null;
    }
};