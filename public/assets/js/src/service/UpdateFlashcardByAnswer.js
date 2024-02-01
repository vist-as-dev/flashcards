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

    easeFactor = Math.max(easeFactor, 1.8);
    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

    return new Flashcard({...card, repetitions, interval, easeFactor, nextReview});
}

export function updateFlashcardByAnswerNew(card, isCorrect) {
    let {repetitions, interval, easeFactor} = card;

    if (isCorrect) {
        switch (easeFactor) {
            case 0:
                interval = 1
                easeFactor += 0.5
                break
            case 0.5:
                interval = 3
                easeFactor += 0.5
                break
            default:
                if (repetitions <= 1) {
                    interval = 1
                } else if (repetitions <= 3) {
                    interval = 3
                } else if (repetitions <= 5) {
                    interval = 7
                } else if (repetitions <= 7) {
                    interval = 14
                } else if (repetitions <= 9) {
                    interval = 30
                } else {
                    interval = 90
                }
                break
        }

        repetitions += 1;
    } else {
        repetitions = Math.max(repetitions - 1, 0);
        interval = 1;
        easeFactor = 0;
    }

    const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

    return new Flashcard({...card, repetitions, interval, easeFactor, nextReview});
}
