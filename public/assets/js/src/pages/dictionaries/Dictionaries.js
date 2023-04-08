import {State} from "../../storage/State";

import {DictionaryList} from "./DictionaryList";
import {WordList} from "./WordList";

export class Dictionaries {
    constructor(container) {
        const state = new State({
            dictionary: null,
        });

        this.components = [
            new DictionaryList(container, state),
            new WordList(container, state),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}