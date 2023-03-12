const field = document.getElementById('upload_file');
const maxSize = 250 * 1024;

field.addEventListener('change', (e) => {
    const [file] = e.target.files;

    if (file.size > maxSize) {
        e.stopPropagation();

        document.getElementById('upload_file_text').value = file.name;
        document.getElementById('upload_file_text').classList.remove('valid');
        document.getElementById('upload_file_text').classList.add('invalid');
        document
            .getElementById('upload_file_helper')
            .dataset.error = 'File too big, please select a file less than 250kb.'
        ;

        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            const content = evt.target.result;
            const textarea = document.getElementById('source_text');

            textarea.value = content;
            M.textareaAutoResize(textarea);

            sourceText = content;
            handle()
        }
        reader.onerror = function (evt) {
            console.log(evt)
        }
    }}
)
