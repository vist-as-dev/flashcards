import {AddForm} from "./AddForm";

export class AddFormDictionary extends AddForm {
    #dictionaries = {};

    constructor(storage) {
        super('div#dictionaries .collection#dictionary-list');

        storage.subscribe(dictionaries => this.#dictionaries = dictionaries);

        this.init(async (name) => {
            if (Object.values(this.#dictionaries).some(dictionary => dictionary.name === name)) {
                throw Error('Already exists');
            }

            await storage.create(name);
        });
    }
}
