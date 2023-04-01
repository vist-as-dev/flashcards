import {NavTabs} from "../../layout";

export class PassOn {
    constructor({navigation}) {
        document.getElementById('pass-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const sentences = document.getElementById('sentences');
            const counter = document.querySelector('.row-counter');

            sentences.value = document.getElementById('source_text').value;
            M.textareaAutoResize(sentences);
            const rows = sentences.value.split("\n");
            const count = rows.filter(i => !!i.length).length;

            counter.innerText = count.toString() + (count === 1 ? ' row' : ' rows');

            navigation.redirect(NavTabs.TAB_ID_FLASHCARDS);
        })
    }

    render() {
    }
}
