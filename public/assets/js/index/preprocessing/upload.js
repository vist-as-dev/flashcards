const field = document.getElementById('upload_file');
const maxSize = 5 * 1024 * 1024;

field.addEventListener('change', (e) => {
    const [file] = e.target.files;

    if (file.size > maxSize) {
        e.stopPropagation();

        document.getElementById('upload_file_text').value = file.name;
        document.getElementById('upload_file_text').classList.remove('valid');
        document.getElementById('upload_file_text').classList.add('invalid');
        document
            .getElementById('upload_file_helper')
            .dataset.error = 'File too big, please select a file less than 5Mb.'
        ;

        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            let content = evt.target.result;
            if (file.name.endsWith('.fb2')) {
                let regex = XRegExp('<binary[^>]*>[^<]*<\\/binary>', 'gm');
                content = XRegExp.replace(content, regex, '\n');

                const matched = content.matchAll(/<section[^>]*?>[^<]*(<title>(?<title>[\s\S]*?)<\/title>)?[^<]*(<subtitle>(?<subtitle>[\s\S]*?)<\/subtitle>)?(?<text>[\s\S]*?)<\/section>/gm);
                const sections = [...matched].reduce((acc, {groups}) => {
                    const title = groups.title && groups.title.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');
                    const subtitle = groups.subtitle && groups.subtitle.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');
                    const text = groups.text && groups.text.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');

                    return {...acc, [title.trim() + (subtitle ? '. ' + subtitle.trim() : '')]: text.trim()};
                }, {["All contents of the book"]: content});


                console.log(sections);
            }

            const textarea = document.getElementById('source_text');

            textarea.value = content;
            M.textareaAutoResize(textarea);

            sourceText = content;
        }
        reader.onerror = function (evt) {
            console.log(evt)
        }
    }}
)
