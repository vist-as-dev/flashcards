import {SelectComponent} from "../../components";

export class FlashcardSelectDictionary {
    #component;

    render(dictionaries) {
        this.#component = new SelectComponent('div#flashcards select#select-dictionary', 'flashcards.dictionary');
        this.#component.render(dictionaries.map(({id, name}) => [id, name]));
    }

    get value() {
        return this.#component.value;
    }
}