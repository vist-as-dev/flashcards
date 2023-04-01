import {DictionaryList} from "./DictionaryList";

export class Dictionaries {
    constructor(container) {
        this.components = [
            new DictionaryList(container),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}