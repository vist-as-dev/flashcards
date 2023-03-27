import {SelectComponent} from "../../components/SelectComponent.js";

export class FlashcardSelectDictionary {
    render(dictionaries) {
        (new SelectComponent('div#download select#select-dictionary', 'download.dictionary')).render(
            dictionaries.map(({id, name}) => [id, name])
        );
    }
}