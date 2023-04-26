import {FlashcardSelectDictionary} from "./FlashcardSelectDictionary";
import {Flashcard} from "../../model";

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

                document
                    .getElementById('sentences').value.split("\n")
                    .filter(i => !!i.length)
                    .filter((word, index, array) => array.indexOf(word) === index)
                    .forEach(original => {
                        if (original in this.#dictionaries[select.value]?.flashcards) {
                            return;
                        }
                        this.#dictionaries[select.value].flashcards[original] = new Flashcard({original});
                    })
                ;
                dictionary.update(this.#dictionaries[select.value]);

                el.classList.remove('spinner')
                el.disabled = false;
            });
    }

    render() {
    }
}
