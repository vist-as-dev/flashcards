import {FlashcardSelectDictionary} from "./FlashcardSelectDictionary";
import {Flashcard} from "../../model";

export class AddToDictionary {
    #dictionaries = {};

    constructor({storage: {dictionary}, synchro: {dictionary: synchro}}) {
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

                const flashcards = document
                    .getElementById('sentences').value.split("\n")
                    .filter(i => !!i.length)
                    .filter((word, index, array) => array.indexOf(word) === index)
                    .filter(original => !(original in this.#dictionaries[select.value]?.flashcards))
                    .map(original => new Flashcard({original}));

                flashcards.forEach(card => this.#dictionaries[select.value].flashcards[card.original] = card);

                dictionary
                    .update(this.#dictionaries[select.value])
                    .then(() => synchro.saveAddedOriginals(
                        this.#dictionaries[select.value].id,
                        flashcards.map(card => card.original)
                    ));

                el.classList.remove('spinner')
                el.disabled = false;
            });
    }

    render() {
    }
}
