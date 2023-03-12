document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/language");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            const source = document.querySelector('select#source');
            const target = document.querySelector('select#target');

            const sourceSelected = localStorage.getItem('source') || Object.keys(response)[0];
            const targetSelected = localStorage.getItem('target') || Object.keys(response)[1];

            Object.keys(response).forEach((code) => {
                source.options.add(
                    new Option(response[code], code, code === sourceSelected, code === sourceSelected)
                );
                target.options.add(
                    new Option(response[code], code, code === targetSelected, code === targetSelected)
                );
            });
            M.FormSelect.init(source);
            M.FormSelect.init(target);

            source.addEventListener("change", function() {
                localStorage.setItem('source', source.value);
            });
            target.addEventListener("change", function() {
                localStorage.setItem('target', target.value);
            });
        } else {
            console.log(xhr.statusText)
        }
    });
    xhr.send();
});