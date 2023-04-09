import {LearningTabs} from "./LearningTabs.js";
import {Addition} from "./addition";

export class Learning {
    constructor(container) {
        this.components = [
            new LearningTabs(),
            new Addition(container),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}