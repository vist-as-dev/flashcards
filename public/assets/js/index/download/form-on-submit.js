document.getElementById("flashcard-form").addEventListener("submit", function(event) {
    event.preventDefault();

    submit();
});
document.getElementById("upload-btn").addEventListener("click", function(event) {
    event.preventDefault();

    submit('upload');
});

function submit(type = 'download') {
    const downloadButton = document.querySelector("#flashcard-form #download-btn");
    const uploadButton = document.querySelector("#flashcard-form #upload-btn");
    downloadButton.disabled = true;
    uploadButton.disabled = true;

    if (type === 'download') {
        downloadButton.classList.add('spinner');
    }
    if (type === 'upload') {
        uploadButton.classList.add('spinner');
    }

    const format = document.querySelector("input[name=format]:checked").value;
    const source = document.getElementById("source").value;
    const target = document.getElementById("target").value;

    const requestBody = {
        text: document.getElementById("sentences").value.split("\n").filter(i => !!i.length),
        source,
        target,
        definitions: document.getElementById("definitions").checked,
        definition_examples: document.getElementById("definition-examples").checked,
        definition_synonyms: document.getElementById("definition-synonyms").checked,
        examples: document.getElementById("examples").checked,
        related_words: document.getElementById("related-words").checked,
        speech_parts: document.getElementById("speech-parts").checked,
        format,
    };

    const formats = {
        anki: {
            extensions: 'txt',
            mimeType: 'text/plain',
        },
        reword: {
            extensions: 'csv',
            mimeType: 'text/csv',
        },
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/translate");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const {content} = JSON.parse(xhr.responseText);
            const blob = new Blob([content], {type: formats[format].mimeType + ";charset=utf-8"});
            const url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);

            let filename = document.getElementById('custom-filename').value;
            if (filename.length === 0) {
                filename = `${format}-${source}-${target}-flashcards.` + formats[format].extensions;
            }

            if (type === 'download') {
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;

                document.body.append(a);
                a.click();
                a.remove();

                (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);

                M.toast({html: 'Done!'})
            }

            if (type === 'upload') {
                GDrive.storage
                    .upload(filename, formats[format].mimeType, content)
                    .then(console.log)
                    .then(() => M.toast({html: 'uploaded'}));
            }
        } else {
            M.toast({html: 'Error: ' + xhr.statusText})
        }

        if (type === 'download') {
            downloadButton.classList.remove('spinner');
        }
        if (type === 'upload') {
            uploadButton.classList.remove('spinner');
        }

        downloadButton.disabled = false;
        uploadButton.disabled = false;
    });

    xhr.send(JSON.stringify(requestBody));
}