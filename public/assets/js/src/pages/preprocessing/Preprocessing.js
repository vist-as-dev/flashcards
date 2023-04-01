import {PassOn} from "./PassOn.js";
import {SourceText} from "./SourceText.js";
import {Upload} from "./Upload.js";
import {PreprocessingOptions} from "./PreprocessingOptions";

export class Preprocessing {
    constructor(container) {
        const sourceText = new SourceText();

        this.components = [
            sourceText,
            new PassOn(container),
            new Upload(sourceText),
            new PreprocessingOptions(sourceText),
        ];
    }

    render() {
        this.components.forEach((component) => component.render());
    }
}