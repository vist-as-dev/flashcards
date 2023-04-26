import {Direction, Dictionary} from "../model";
import {Storage} from "./Storage";
import {WordStorage} from "./WordStorage";

export class DictionaryStorage1 extends Storage {
    #items = {};
    #direction = {};
    #isLoaded = false;

    constructor(api, direction) {
        super();
        this.api = api;

        direction.subscribe((direction) => {
            this.#direction = new Direction(direction);
            this.#isLoaded = false;

            const {source, target} = this.#direction;
            document.querySelector('#dictionary-list .scrollable').classList.add('loader');

            this.api.listFiles({type: 'dictionary', source, target})
                .then(files => files.reverse())
                .then((files) => {
                    this.#isLoaded = true;
                    document.querySelector('#dictionary-list .scrollable').classList.remove('loader');

                    const ids = files.map((id) => id);
                    Object.keys(this.#items).forEach(id => {
                        if (!ids.includes(id)) {
                            this.#items[id]?.unsubscribe && this.#items[id].unsubscribe();
                            delete this.#items[id];
                        }
                    });
                    this.notify(this.#items);

                    files.forEach(({id, properties}) => {
                        this.#set(id, properties);
                        this.api.downloadMetaFile(id).then(data => this.#items[id]?.words.set(data));
                    });
                });
        });
    }

    subscribe(callback) {
        this.#isLoaded && callback(this.#items);
        return super.subscribe(callback);
    }

    #set(id, data) {
        if (this.#direction.source !== data.source || this.#direction.target !== data.target) {
            return;
        }

        if (id) {
            const dictionary = new Dictionary({id, ...data});
            if (this.#items[id]?.words instanceof WordStorage) {
                dictionary.words = this.#items[id].words;
                dictionary.unsubscribe = this.#items[id].unsubscribe;
            } else {
                dictionary.words = new WordStorage(dictionary);
                dictionary.unsubscribe = dictionary.words.subscribe(async (words) => {
                    this.notify(this.#items);
                    await this.api.updateMetaFile(id, words);
                    this.update(id, {count: Object.keys(words).length});
                });
            }
            this.#items[id] = dictionary;
            this.notify(this.#items);
        }
    }

    async create(name) {
        const {source, target} = this.#direction;
        const data = {name, source, target, type: 'dictionary'};
        const {id} = await this.api.createMetaFile(encodeURIComponent(name), data);

        this.#set(id, data);
        this.#items[id]?.words.set({});
    }

    update(id, data) {
        this.api.updateMetaFileProperties(id, data).then(() => {
            this.#set(id, {...this.#items[id], ...data});
        });
    }

    delete(id) {
        this.api.deleteMetaFile(id).then(() => {
            this.#items[id]?.unsubscribe && this.#items[id].unsubscribe();
            delete this.#items[id];
            this.notify(this.#items);
        });
    }
}
