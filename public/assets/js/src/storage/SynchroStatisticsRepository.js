// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {synchroStatistics as schema} from "./schemes";
import {DayStatistics} from "../model";

addRxPlugin(RxDBDevModePlugin);

export class SynchroStatisticsRepository {
    #db;
    #statistics;

    async init(direction) {
        const db = await createRxDatabase({
            name: 'synchro_statistics_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {synchro} = await db.addCollections({synchro: schema});
        this.#db = synchro;
        this.#db.preInsert(data => data.lastSynchroTimestamp = Date.now(), true);

        direction.subscribe((direction) => {
            document.querySelector('#statistics .card-content').classList.add('loader');
            const {source, target} = direction;
            this.#db.findOne({selector: {source, target}})
                .exec()
                .then(async doc => this.#statistics = doc || await this.#db.insert({source, target}));
        });
    }

    #save(key) {
        const days = this.#statistics.days.reduce((days, day) => ({...days, [day.localeDate]: {...day}}), {});
        const day = new Date().toLocaleDateString();

        if (!(day in days)) {
            days[day] = {localeDate: day, ...new DayStatistics()};
        }

        const dayStatistics = {...days[new Date().toLocaleDateString()]};
        days[new Date().toLocaleDateString()] = {...dayStatistics, [key]: ++dayStatistics[key]};

        return this.#statistics.incrementalPatch({days: Object.values(days)});
    }

    addStarted = () => this.#save('started');
    addRepeated = () => this.#save('repeated');
    addCompleted = () => this.#save('completed');
    addWellKnown = () => this.#save('wellKnown');

    delete(source, target) {
        return this.#db.findOne({source, target}).exec().then(doc => doc && doc.remove());
    }
}
