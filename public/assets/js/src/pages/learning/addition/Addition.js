import {Dictionaries} from "./Dictionaries";
import {AdditionState} from "./AdditionState";
import {Word} from "./Word";

export class Addition {
    constructor(container) {
        const state = new AdditionState(container);

        this.components = [
            new Dictionaries(container, state),
            new Word(container, state),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}