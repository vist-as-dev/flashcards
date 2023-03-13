document.getElementById("flashcard-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const downloadButton = document.querySelector("#flashcard-form #download-btn");
    const preloader = document.querySelector("#flashcard-form .preloader-wrapper");
    downloadButton.classList.add('hide');
    preloader.classList.remove('hide');


    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/translate");
    xhr.setRequestHeader("Content-Type", "application/json");

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

    const extensions = {
        anki: 'txt',
        reword: 'csv',
    };

    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const {content} = JSON.parse(xhr.responseText);
            const blob = new Blob([content], {type: "text/csv;charset=utf-8"});
            const url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `${format}-${source}-${target}-flashcards.` + extensions[format];

            document.body.append(a);
            a.click();
            a.remove();

            (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);

            document
                .getElementById("flashcard-form-response")
                .innerHTML = "Done!";
        } else {
            document
                .getElementById("flashcard-form-response")
                .innerHTML = "Error: " + xhr.statusText;
        }

        downloadButton.classList.remove('hide');
        preloader.classList.add('hide');
    });

    xhr.send(JSON.stringify(requestBody));
});