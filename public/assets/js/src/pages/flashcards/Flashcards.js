import {AddToDictionary} from "./AddToDictionary";
import {Format} from "./Format";
import {OnSubmit} from "./OnSubmit";
import {Options} from "./Options";
import {RowCounter} from "./RowCounter";

export class Flashcards {
    constructor(container) {
        this.components = [
            new AddToDictionary(container),
            new Format(),
            new OnSubmit(container),
            new Options(),
            new RowCounter(),
        ];
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}