document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/translate");
    xhr.setRequestHeader("Content-Type", "application/json");

    const format = document.querySelector("input[name=format]:checked").value;
    const source = document.getElementById("source").value;
    const target = document.getElementById("target").value;

    const requestBody = {
        text: document.getElementById("sentences").value.split("\n").filter(i => !!i.length).slice(0, 20),
        source,
        target,
        definitions: document.getElementById("definitions").checked,
        definition_examples: document.getElementById("definition_examples").checked,
        definition_synonyms: document.getElementById("definition_synonyms").checked,
        examples: document.getElementById("examples").checked,
        format,
    };

    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const {csv} = JSON.parse(xhr.responseText);
            const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
            const url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `${format}-${source}-${target}-flashcards.csv`;

            document.body.append(a);
            a.click();
            a.remove();

            (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);

            document
                .getElementById("myResponse")
                .innerHTML = "Done!";
        } else {
            document.getElementById("myErrors").innerHTML = "Error: " + xhr.statusText;
        }
    });

    xhr.send(JSON.stringify(requestBody));
});