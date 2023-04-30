import {AddForm} from "./AddForm";

export class AddFormDictionary extends AddForm {
    #dictionaries = {};

    constructor(storage) {
        super('div#dictionaries .collection#dictionary-list');

        storage.subscribe(dictionaries => this.#dictionaries = dictionaries);

        this.init(async (name) => {
            if (Object.values(this.#dictionaries).some(dictionary => dictionary.name === name)) {
                const body = document.querySelector('div#dictionaries .collection#dictionary-list .collection-body');
                const item = body.querySelector(`[data-dictionary="${name}"]`);
                body.removeChild(body.querySelector(`[data-dictionary="${name}"]`));
                body.prepend(item);
                item.classList.add('pulse');
                setTimeout(() => item.classList.remove('pulse'), 1000);

                throw Error('Already exists');
            }

            await storage.create(name);
        });
    }
}
