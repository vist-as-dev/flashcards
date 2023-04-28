import {Flashcard} from "../model";

export class WordStatus {
    static map = {
        [Flashcard.STATUS_NEW]: {color: 'deep-purple-text darken-1', text: 'new'},
        [Flashcard.STATUS_IN_PROGRESS]: {color: 'indigo-text darken-1', text: 'in progress'},
        [Flashcard.STATUS_COMPLETED]: {color: 'grey-text darken-1', text: 'completed'},
        [Flashcard.STATUS_WELL_KNOWN]: {color: 'grey-text', text: 'well-known'},
    }
}