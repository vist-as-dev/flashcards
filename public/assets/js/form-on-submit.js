document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/translate");
    xhr.setRequestHeader("Content-Type", "application/json");

    const requestBody = {
        text: document.getElementById("sentences").value.split("\n").filter(i => !!i.length).slice(0, 20),
        source: document.getElementById("source").value,
        target: document.getElementById("target").value,
        definitions: document.getElementById("definitions").checked,
        definition_examples: document.getElementById("definition_examples").checked,
        definition_synonyms: document.getElementById("definition_synonyms").checked,
        examples: document.getElementById("examples").checked,
        format: document.querySelector("input[name=format]:checked").value,
    };

    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            document
                .getElementById("myResponse")
                .innerHTML = "Link for download: <a href='http://localhost'>" + response.message + "</a>";
        } else {
            document.getElementById("myErrors").innerHTML = "Error: " + xhr.statusText;
        }
    });

    xhr.send(JSON.stringify(requestBody));
});