import {DictionaryStorage} from "./DictionaryStorage.js";
import {DictionaryListItem} from "./DictionaryListItem.js";

export class DictionaryList {
    constructor(storage) {
        this.el = document.querySelector('div#dictionaries .collection');
        // this.storage = storage;
        this.storage = new DictionaryStorage();
    }

    async render() {
        this.el.innerHTML = '';

        const list = await this.storage.list();
        const item = new DictionaryListItem();
        list.forEach((dictionary) => {
            this.el.appendChild(item.render(dictionary.id, dictionary.name))
        });

        this.el.appendChild(item.renderAddDictionaryItem());
    }
}