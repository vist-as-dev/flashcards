export class RowCounter {
    constructor() {
        this.sentences = document.getElementById('sentences');
        this.counter = document.querySelector('.row-counter');
        this.sentences.addEventListener('input', () => {
            const rows = this.sentences.value.split("\n");
            const count = rows.filter(i => !!i.length).length;

            this.counter.innerText = count.toString() + (count === 1 ? ' row' : ' rows');
        });
    }

    render() {
    }
}
