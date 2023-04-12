import {Word} from "../model";

export class WordStatus {
    static map = {
        [Word.STATUS_NEW]: {color: 'deep-purple-text darken-1', text: 'new'},
        [Word.STATUS_IN_PROGRESS]: {color: 'indigo-text darken-1', text: 'in progress'},
        [Word.STATUS_COMPLETED]: {color: 'grey-text darken-1', text: 'completed'},
        [Word.STATUS_WELL_KNOWN]: {color: 'grey-text', text: 'well-known'},
    }
}