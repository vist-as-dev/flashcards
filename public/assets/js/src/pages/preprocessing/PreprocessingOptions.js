import {options, splitToRows} from "./options";

export class PreprocessingOptions {
    constructor(sourceText) {
        this.sourceText = sourceText;

        document.getElementById('apply-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            this.handle();
        });
        document.getElementById('turnOnAllOptions').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            this.turnAll(true);
        });
        document.getElementById('turnOffAllOptions').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            this.turnAll(false);
        });
    }

    render() {
    }

    handle() {
        let {content} = this.sourceText;

        for (const option of options) {
            content = option.handle(content);
        }

        document.getElementById('source_text').value = content;
        document.getElementById('text_volume').innerHTML = content.length.toString() + ' characters / ' + splitToRows(content).length.toString() + ' rows';
    }

    turnAll(value) {
        options.forEach((option) => option.set(value).save());
    }
}
