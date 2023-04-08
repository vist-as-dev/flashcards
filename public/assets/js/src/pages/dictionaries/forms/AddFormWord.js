import {AddForm} from "./AddForm";

export class AddFormWord extends AddForm {
    #words = {};
    #storage;
    #unsubscribe;

    constructor() {
        super('div#dictionaries .collection#word-list');

        this.init(async (word) => {
            if (Object.values(this.#words).some(item => item.word === word)) {
                throw Error('Already exists');
            }

            this.#storage.add([word]);


        });
    }

    setStorage(storage) {
        this.#storage = storage;

        this.#unsubscribe && this.#unsubscribe();
        this.#unsubscribe = this.#storage.subscribe(words => this.#words = words);
    }
}
