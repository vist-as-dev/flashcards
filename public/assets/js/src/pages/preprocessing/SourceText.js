import {splitToRows} from "./options";

export class SourceText {

    constructor() {
        this.content = 'This text is editable!\n' +
            'You can copy and paste your own text into this space,\n' +
            'or upload a text file, a file with movie subtitles,\n' +
            'or an eBook in FB2 format.';

        const textarea = document.getElementById('source_text');
        textarea.innerHTML = this.content;

        const characters = this.content.length;
        const rows = splitToRows(this.content).length;
        document.getElementById('text_volume').innerHTML = characters + ' characters / ' + rows + (rows === 1 ? ' row' : ' rows');

        textarea.addEventListener('input', (e) => {
            const content = e.target.value;
            const characters = content.length;
            const rows = splitToRows(content).length;

            document.getElementById('text_volume').innerHTML = characters + ' characters / ' + rows + (rows === 1 ? ' row' : ' rows');

            if (document.getElementById('upload_file_text').value.length === 0) {
                this.content = e.target.value;
            }
        });
    }

    render() {
    }
}
