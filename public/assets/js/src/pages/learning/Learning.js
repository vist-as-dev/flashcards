import {LearningTabs} from "./LearningTabs.js";
import {Dictionaries} from "./Dictionaries";

export class Learning {
    constructor(container) {
        this.components = [
            new LearningTabs(),
            new Dictionaries(container),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}