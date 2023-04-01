import {LearningTabs} from "./LearningTabs.js";

export class Learning {
    constructor(container) {
        this.components = [
            new LearningTabs(),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}