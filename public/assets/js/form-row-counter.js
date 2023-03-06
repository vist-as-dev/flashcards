const textarea = document.getElementById("sentences");
const counter = document.querySelector(".row-counter");

textarea.addEventListener("input", function() {
    const rows = textarea.value.split("\n");
    const count = rows.filter(i => !!i.length).length;

    counter.innerText = count > 20 ? 'Only the first 20 lines will be processed!' : count;
});
