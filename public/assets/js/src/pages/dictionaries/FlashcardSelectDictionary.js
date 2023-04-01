import {SelectComponent} from "../../components";

export class FlashcardSelectDictionary {
    render(dictionaries) {
        const component = new SelectComponent('div#flashcards select#select-dictionary', 'flashcards.dictionary');
        component.render(dictionaries.map(({id, name}) => [id, name]));
    }
}