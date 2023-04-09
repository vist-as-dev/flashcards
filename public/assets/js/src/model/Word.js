export class Word {
    static STATUS_NEW = 0;
    static STATUS_STARTED = 1;
    static STATUS_FIRST_STEP = 2;
    static STATUS_SECOND_STEP = 3;
    static STATUS_THIRD_STEP = 4;
    static STATUS_FORTH_STEP = 5;
    static STATUS_FIFTH_STEP = 6;
    static STATUS_COMPLETED = 7;
    static STATUS_WELL_KNOWN = 8;

    constructor({word, glossary = {}, image = '', step = 0, timestamp = Date.now()}) {
        this.word = word;
        this.glossary = glossary;
        this.image = image;
        this.step = +step;
        this.timestamp = timestamp;
    }
}
