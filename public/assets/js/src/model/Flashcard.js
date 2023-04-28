export class Flashcard {
    static STATUS_NEW = 0;
    static STATUS_IN_PROGRESS = 1;
    static STATUS_COMPLETED = 2;
    static STATUS_WELL_KNOWN = 3;

    constructor({
                    original,
                    glossary = {},
                    image = '',

                    status = 0,

                    repetitions = 0,
                    interval = 1,
                    easeFactor = 2.5,
                    nextReview = Date.now()
                }) {
        this.original = original;
        this.glossary = glossary;
        this.image = image;

        this.status = +status;

        this.repetitions = +repetitions;
        this.interval = +interval;
        this.easeFactor = +easeFactor;
        this.nextReview = +nextReview;
    }
}
