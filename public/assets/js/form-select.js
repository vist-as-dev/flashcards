document.addEventListener('DOMContentLoaded', function() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/language");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);

            const source = document.querySelector('select#source');
            const target = document.querySelector('select#target');
            Object.keys(response).forEach((code, i) => {
                source.options.add(new Option(response[code], code, i === 0, i === 0))
                target.options.add(new Option(response[code], code, i === 1, i === 1))
            });
            M.FormSelect.init(source);
            M.FormSelect.init(target);
        } else {
            console.log(xhr.statusText)
        }
    });
    xhr.send();
});