import {LearningTabs} from "./LearningTabs.js";
import {Addition} from "./addition";
import {Memorization} from "./memorization";

export class Learning {
    constructor(container) {
        this.components = [
            new LearningTabs(),
            new Addition(container),
            new Memorization(container),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}