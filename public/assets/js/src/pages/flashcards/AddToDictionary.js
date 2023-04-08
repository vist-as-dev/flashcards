import {FlashcardSelectDictionary} from "./FlashcardSelectDictionary";

export class AddToDictionary {
    #dictionaries = {};

    constructor({storage: {dictionary}}) {
        const select = new FlashcardSelectDictionary();
        dictionary.subscribe((dictionaries) => {
            this.#dictionaries = dictionaries;
            select.render(Object.values(dictionaries));
        });

        document
            .querySelector('div#flashcards button#add-to-dictionary-btn')
            .addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const el = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
                el.disabled = true;
                el.classList.add('spinner')

                const words = document
                    .getElementById('sentences').value.split("\n")
                    .filter(i => !!i.length)
                    .filter((word, index, array) => array.indexOf(word) === index)
                ;

                this.#dictionaries[select.value]?.words?.add(words);

                el.classList.remove('spinner')
                el.disabled = false;
            });
    }

    render() {
    }
}
