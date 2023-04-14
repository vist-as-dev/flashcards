import {LearningTabs} from "./LearningTabs.js";
import {Addition} from "./addition";
import {Memorization} from "./memorization";
import {Statistics} from "./statistics";

export class Learning {
    constructor(container) {
        this.components = [
            new LearningTabs(),
            new Addition(container),
            new Memorization(container),
            new Statistics(container),
        ]
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}