import {Chart} from "./Chart";
import {Options} from "./Options";
import {OptionsState} from "./OptionsState";

export class Statistics {
    constructor(container) {
        const state = new OptionsState();

        this.components = [
            new Options(state),
            new Chart(container, state),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}