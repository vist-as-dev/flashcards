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
            name: 'synchro_dictionary_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {synchro} = await db.addCollections({synchro: schema});
        this.#db = synchro;
        this.#db.preInsert(data => data.lastSynchroTimestamp = Date.now(), true);
    }

    saveAddedOriginals(dictionaryId, originals) {
        return this.#db.findOne(dictionaryId).exec().then(async doc => {
            if (null === doc) {
                doc = await this.#db.insert({dictionaryId});
            }
            doc.incrementalPatch({addedList: [...new Set([...doc.addedList, ...originals])]});
        });
    }

    saveDeletedOriginal(dictionaryId, originals) {
        return this.#db.findOne(dictionaryId).exec().then(async doc => {
            if (null === doc) {
                doc = await this.#db.insert({dictionaryId});
            }
            doc.incrementalPatch({deletedList: [...new Set([...doc.deletedList, ...originals])]});
        });
    }

    delete(dictionaryId) {
        return this.#db.findOne(dictionaryId).exec().then(async doc => {
            if (null === doc) {
                doc = await this.#db.insert({dictionaryId});
            }
            doc.incrementalPatch({isDeleted: 1});
        });
    }
}
