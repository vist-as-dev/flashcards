document.addEventListener('DOMContentLoaded', function() {
    const formats = [...document.querySelectorAll("input[name=format]")];

    for (const i in formats) {
        if (localStorage.getItem('sentences.format')) {
            formats[i].checked = formats[i].value === localStorage.getItem('sentences.format');
        } else {
            formats[i].checked = i === 0;
        }

        formats[i].addEventListener("change", function() {
            if (formats[i].checked) {
                localStorage.setItem('sentences.format', formats[i].value);
            }
        });
    }
});