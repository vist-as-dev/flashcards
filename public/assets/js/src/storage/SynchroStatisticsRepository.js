// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {synchroStatistics as schema} from "./schemes";
import {DayStatistics} from "../model";

addRxPlugin(RxDBDevModePlugin);

export class SynchroStatisticsRepository {
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

    insert(source, target) {
        return this.#db.insert({source, target});
    }

    find(source, target) {
        return this.#db.findOne({source, target}).exec();
    }

    #getDays(doc) {
        const days = doc.days.reduce((days, day) => ({...days, [day.localeDate]: day}), {});
        const day = new Date().toLocaleDateString();

        if (!(day in days)) {
            days[day] = {localeDate: day, ...new DayStatistics()};
        }

        return days;
    }

    #save(source, target, key) {
        return this.#db.findOne({source, target}).exec().then(doc => {
            const days = this.#getDays(doc);
            days[new Date().toLocaleDateString()][key]++;
            doc.incrementalPatch({days});
        });
    }

    saveStarted = (source, target) => this.#save(source, target, 'started');
    saveRepeated = (source, target) => this.#save(source, target, 'repeated');
    saveCompleted = (source, target) => this.#save(source, target, 'completed');
    saveWellKnown = (source, target) => this.#save(source, target, 'wellKnown');

    delete(source, target) {
        return this.#db.findOne({source, target}).exec().then(doc => doc && doc.remove());
    }
}
