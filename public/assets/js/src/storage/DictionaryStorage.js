import {Direction, Dictionary, Flashcard} from "../model";
import {Storage} from "./Storage";
import {DictionaryRepository} from "./DictionaryRepository";

export class DictionaryStorage extends Storage {
    #items = {};
    #direction = {};
    #isLoaded = false;

    #repo;

    constructor() {
        super();
        this.#repo = new DictionaryRepository();
    }

    async init(direction) {
        await this.#repo.init();

        direction.subscribe((direction) => {
            this.#direction = new Direction(direction);

            this.#isLoaded = false;
            document.querySelector('#dictionary-list .scrollable').classList.add('loader');

            this.#$.subscribe(docs => {
                this.#isLoaded = true;
                document.querySelector('#dictionary-list .scrollable').classList.remove('loader');

                this.#items = docs ? docs.reduce((items, doc) => ({...items, [doc.id]: this.toModel(doc)}), {}) : {};
                this.notify(this.#items);
            });
        });
    }

    get #$() {
        if (this.#repo instanceof DictionaryRepository) {
            return this.#repo.$(this.#direction);
        }
    }

    toModel(doc) {
        return new Dictionary({
            id: doc.get('id'),
            gDriveFileId: doc.get('gDriveFileId'),
            name: doc.get('name'),
            source: doc.get('source'),
            target: doc.get('target'),
            flashcards: doc.get('flashcards').reduce(
                (items, card) => ({...items, [card.original]: new Flashcard(card)}),
                {}
            ),
        });
    }

    subscribe(callback) {
        this.#isLoaded && callback(this.#items);
        return super.subscribe(callback);
    }

    create(name) {
        if (this.#repo instanceof DictionaryRepository) {
            this.#repo.insert(new Dictionary({name, ...this.#direction}));
        }
    }

    update(dictionary) {
        if (this.#repo instanceof DictionaryRepository) {
            return this.#repo.update({...dictionary, flashcards: Object.values(dictionary.flashcards)});
        }
    }

    delete(dictionary) {
        if (this.#repo instanceof DictionaryRepository) {
            return this.#repo.delete(dictionary);
        }
    }
}
