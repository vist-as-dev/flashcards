import {Dictionary} from "../model";
import {Storage} from "./Storage";
import {WordCollection} from "./WordCollection";
import {Direction} from "../model/Direction";

export class DictionaryCollection extends Storage {
    #items = {};
    #direction = {};

    constructor(api, direction) {
        super();
        this.api = api;

        direction.subscribe((direction) => {
            this.#direction = new Direction(direction);

            const {source, target} = this.#direction;
            this.api.listFiles({type: 'dictionary', source, target})
                .then(files => files.reverse())
                .then((files) => {
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
                        this.api.downloadMetaFile(id).then(data => this.#items[id].words.set(data));
                    });
                });
        });
    }

    subscribe(callback) {
        callback(this.#items);
        return super.subscribe(callback);
    }

    #set(id, data) {
        if (id) {
            const dictionary = new Dictionary({id, ...data});
            if (this.#items[id]?.words instanceof WordCollection) {
                dictionary.words = this.#items[id].words;
                dictionary.unsubscribe = this.#items[id].unsubscribe;
            } else {
                dictionary.words = new WordCollection(dictionary);
                dictionary.unsubscribe = dictionary.words.subscribe(async (words) => {
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

        this.#set(id, data)
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
