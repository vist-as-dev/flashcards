let sourceText = '';

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('source_text');

    textarea.addEventListener('input', (e) => {
        const content = e.target.value;
        const characters = content.length;
        const rows = splitToRows(content).length;

        document.getElementById('text_volume').innerHTML = characters + ' characters / ' + rows + (rows === 1 ? ' row' : ' rows');

        if (document.getElementById('upload_file_text').value.length === 0) {
            sourceText = e.target.value;
        }
    });
});