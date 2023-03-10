const sentences = document.getElementById("sentences");
const counter = document.querySelector(".row-counter");

function setSentencesCounter() {
    const rows = sentences.value.split("\n");
    const count = rows.filter(i => !!i.length).length;

    counter.innerText = count.toString() + (count === 1 ? ' row' : ' rows');
}

sentences.addEventListener("input", setSentencesCounter);
