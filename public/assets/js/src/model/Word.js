export class Word {
    constructor({word, glossary = {}, image = '', step = 0, timestamp = Date.now()}) {
        this.word = word;
        this.glossary = glossary;
        this.image = image;
        this.step = step;
        this.timestamp = timestamp;
    }
}
