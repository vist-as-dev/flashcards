document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pass-btn').addEventListener('click', (e) => {
        e.stopPropagation();

        sentences.value = document.getElementById('source_text').value;
        M.textareaAutoResize(sentences);
        setSentencesCounter();

        switchDownloadTab();
    })
});