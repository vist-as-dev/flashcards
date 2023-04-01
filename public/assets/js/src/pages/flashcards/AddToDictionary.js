export class AddToDictionary {
    constructor({storage: dictionaries}) {
        this.storage = dictionaries;
    }

    render() {
        document.addEventListener('DOMContentLoaded', () => {
            document
                .querySelector('div#flashcards button#add-to-dictionary-btn')
                .addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    e.target.disabled = true;
                    e.target.classList.add('spinner')

                    const words = document
                        .getElementById('sentences').value.split("\n")
                        .filter(i => !!i.length)
                        .filter((word, index, array) => array.indexOf(word) === index)
                    ;
                    const dictionaryId = document.getElementById('select-dictionary').value;

                    for (const word of words) {
                        await this.storage.createWord(word, {id: dictionaryId});
                    }

                    e.target.classList.remove('spinner')
                    e.target.disabled = false;
                });
        });
    }
}
