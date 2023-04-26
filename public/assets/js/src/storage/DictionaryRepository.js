// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {dictionaries as schema} from "./schemes";

addRxPlugin(RxDBDevModePlugin);

export class DictionaryRepository {
    #db;

    async init() {
        const db = await createRxDatabase({
            name: 'dictionary_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {dictionaries} = await db.addCollections({dictionaries: schema});
        this.#db = dictionaries;
    }

    $({source, target}) {
        return this.#db.find({selector: {source, target}}).$;
    }

    insert(document) {
        return this.#db.insert(document);
    }

    update(document) {
        return this.#db.findOne(document.id).exec().then(doc => doc && doc.incrementalPatch(document));
    }

    delete(document) {
        return this.#db.findOne(document.id).exec().then(doc => doc && doc.remove());
    }
}
