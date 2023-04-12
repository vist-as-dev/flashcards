import {MemorizationState} from "./MemorizationState";
import {Word} from "./Word";

export class Memorization {
    constructor(container) {
        const state = new MemorizationState(container);

        this.components = [
            new Word(container, state),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}