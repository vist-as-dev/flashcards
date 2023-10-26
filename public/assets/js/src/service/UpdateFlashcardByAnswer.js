import {Flashcard} from "../model";

export function updateFlashcardByAnswer(card, isCorrect) {
    let {repetitions, interval, easeFactor} = card;

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
        repetitions = Math.max(repetitions - 1, 0);
        interval = 1;
        easeFactor -= 0.8;
    }

    easeFactor = Math.max(easeFactor, 1.3);
    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

    return new Flashcard({...card, repetitions, interval, easeFactor, nextReview});
}
