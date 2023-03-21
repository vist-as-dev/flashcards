const field = document.getElementById('upload_file');
const maxSize = 7 * 1024 * 1024;

field.addEventListener('change', (e) => {
    const [file] = e.target.files;

    if (file.size > maxSize) {
        e.stopPropagation();

        document.getElementById('upload_file_text').value = file.name;
        document.getElementById('upload_file_text').classList.remove('valid');
        document.getElementById('upload_file_text').classList.add('invalid');
        document
            .getElementById('upload_file_helper')
            .dataset.error = 'File too big, please select a file less than 7Mb.'
        ;

        return;
    }

    function refresh(text) {
        const textarea = document.getElementById('source_text');

        textarea.value = text;
        M.textareaAutoResize(textarea);

        sourceText = text;
    }

    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            let content = evt.target.result;

            const chapters = document.querySelector('select#chapters');
            if (file.name.endsWith('.fb2')) {
                const ebook = new FB2(content);
                ebook.initSelectChapterField(chapters, refresh);

                content = ebook.content;

                chapters.closest('.col').classList.remove('hide');
            } else {
                chapters.closest('.col').classList.add('hide');
            }

            refresh(content);
        }
        reader.onerror = function (evt) {
            console.log(evt)
        }
    }}
)
