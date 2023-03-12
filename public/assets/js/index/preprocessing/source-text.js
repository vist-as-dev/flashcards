let sourceText = '';

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('source_text');

    textarea.addEventListener('input', (e) => {
        document.getElementById('text_volume').innerHTML = e.target.value.length;

        if (document.getElementById('upload_file_text').value.length === 0) {
            sourceText = e.target.value;
        }
    });
});