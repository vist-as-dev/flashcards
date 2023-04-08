export class WordStatus {
    static STATUS_NEW = 0;
    static STATUS_STARTED = 1;
    static STATUS_FIRST_STEP = 2;
    static STATUS_SECOND_STEP = 3;
    static STATUS_THIRD_STEP = 4;
    static STATUS_FORTH_STEP = 5;
    static STATUS_FIFTH_STEP = 6;
    static STATUS_COMPLETED = 7;
    static STATUS_WELL_KNOWN = 8;

    static getAttributes(key) {
        const map = {
            [WordStatus.STATUS_NEW]: {color: 'deep-purple-text darken-1', text: 'new'},
            [WordStatus.STATUS_STARTED]: {color: 'indigo-text darken-1', text: 'started'},
            [WordStatus.STATUS_FIRST_STEP]: {color: 'blue-text darken-1', text: 'first step'},
            [WordStatus.STATUS_SECOND_STEP]: {color: 'light-blue-text darken-1', text: 'second step'},
            [WordStatus.STATUS_THIRD_STEP]: {color: 'cyan-text darken-1', text: 'third step'},
            [WordStatus.STATUS_FORTH_STEP]: {color: 'teal-text darken-1', text: 'forth step'},
            [WordStatus.STATUS_FIFTH_STEP]: {color: 'green-text darken-1', text: 'fifth step'},
            [WordStatus.STATUS_COMPLETED]: {color: 'grey-text darken-1', text: 'completed'},
            [WordStatus.STATUS_WELL_KNOWN]: {color: 'grey-text', text: 'well-known'},
        }

        return map[key] || map[WordStatus.STATUS_NEW];
    }
}