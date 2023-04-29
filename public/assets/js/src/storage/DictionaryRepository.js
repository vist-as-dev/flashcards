// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {Storage} from "./Storage";
import {dictionaries as schema} from "./schemes";
import {Dictionary, Direction, Flashcard} from "../model";

addRxPlugin(RxDBDevModePlugin);

export class DictionaryRepository extends Storage {
    #db;
    #direction;
    #items;

    async init(direction) {
        const db = await createRxDatabase({
            name: 'dictionary_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {dictionaries} = await db.addCollections({dictionaries: schema});
        this.#db = dictionaries;

        direction.subscribe((direction) => {
            this.#direction = new Direction(direction);

            document.querySelector('#dictionary-list .scrollable').classList.add('loader');

            this.#db.find({selector: {...direction}}).$.subscribe(docs => {
                document.querySelector('#dictionary-list .scrollable').classList.remove('loader');

                this.#items = docs ? docs.reduce((items, doc) => ({...items, [doc.id]: this.#toModel(doc)}), {}) : {};
                this.notify(this.#items);
            });
        });
    }

    #toModel(doc) {
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

    create(name) {
        this.#db.insert(new Dictionary({name, ...this.#direction, flashcards: []}));
    }

    insert(dictionary) {
        return this.#db.upsert({...dictionary});
    }

    all() {
        return this.#db.find().exec().then(docs => docs.map(doc => this.#toModel(doc)));
    }

    update(dictionary) {
        return this.#db
            .findOne(dictionary.id).exec()
            .then(doc => doc && doc.incrementalPatch({
                ...dictionary,
                flashcards: Object.values(dictionary.flashcards)
            }));
    }

    delete(dictionary) {
        return this.#db.findOne(dictionary.id).exec().then(doc => doc && doc.remove());
    }
}
