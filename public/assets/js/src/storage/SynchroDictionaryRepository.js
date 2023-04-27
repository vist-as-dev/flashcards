// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {synchroDictionary as schema} from "./schemes";

addRxPlugin(RxDBDevModePlugin);

export class SynchroDictionaryRepository {
    #db;

    async init() {
        const db = await createRxDatabase({
            name: 'synchro_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {synchro} = await db.addCollections({synchro: schema});
        this.#db = synchro;
        this.#db.preInsert(data => data.lastSynchroTimestamp = Date.now(), true);
    }

    insert(dictionaryId) {
        return this.#db.insert({dictionaryId});
    }

    find(dictionaryId) {
        return this.#db.findOne(dictionaryId).exec();
    }

    saveAddedOriginal(dictionaryId, original) {
        return this.#db.findOne(dictionaryId).exec().then(doc => {
            doc.added.push(original);
            doc.incrementalPatch({added: doc.added})
        });
    }

    saveDeletedOriginal(dictionaryId, original) {
        return this.#db.findOne(dictionaryId).exec().then(doc => {
            doc.deleted.push(original);
            doc.incrementalPatch({deleted: doc.added})
        });
    }

    delete(dictionaryId) {
        return this.#db.findOne(dictionaryId).exec().then(doc => doc && doc.remove());
    }
}
