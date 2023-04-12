import {Word} from "../model";

export function updateWordByAnswer(word, isCorrect) {
    let {repetitions, interval, easeFactor, nextReview} = word;

    console.log({repetitions, interval, easeFactor, nextReview})

    if (isCorrect) {
        repetitions += 1;
        if (repetitions <= 1) {
            interval = 1;
        } else if (repetitions === 2) {
            interval = 6;
        } else {
            interval *= easeFactor;
        }
        easeFactor += (0.1 - (5 - 1) * (0.08 + (5 - 1) * 0.02));
    } else {
        repetitions = 0;
        interval = 1;
        easeFactor -= 0.8;
    }

    easeFactor = Math.max(easeFactor, 1.3);
    nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

    console.log(new Word({...word, repetitions, interval, easeFactor, nextReview}));
    return new Word({...word, repetitions, interval, easeFactor, nextReview});
}
