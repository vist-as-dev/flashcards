import {Word} from "../model";

export class WordStatus {
    static getAttributes(key) {
        const map = {
            [Word.STATUS_NEW]: {color: 'deep-purple-text darken-1', text: 'new'},
            [Word.STATUS_STARTED]: {color: 'indigo-text darken-1', text: 'started'},
            [Word.STATUS_FIRST_STEP]: {color: 'blue-text darken-1', text: 'first step'},
            [Word.STATUS_SECOND_STEP]: {color: 'light-blue-text darken-1', text: 'second step'},
            [Word.STATUS_THIRD_STEP]: {color: 'cyan-text darken-1', text: 'third step'},
            [Word.STATUS_FORTH_STEP]: {color: 'teal-text darken-1', text: 'forth step'},
            [Word.STATUS_FIFTH_STEP]: {color: 'green-text darken-1', text: 'fifth step'},
            [Word.STATUS_COMPLETED]: {color: 'grey-text darken-1', text: 'completed'},
            [Word.STATUS_WELL_KNOWN]: {color: 'grey-text', text: 'well-known'},
        }

        return map[key] || map[Word.STATUS_NEW];
    }
}