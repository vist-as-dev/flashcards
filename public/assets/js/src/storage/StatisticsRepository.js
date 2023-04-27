// import {createRxDatabase} from "rxdb";
import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

import {statistics as schema} from "./schemes";
import {DayStatistics} from "../model";
import {Storage} from "./Storage";

addRxPlugin(RxDBDevModePlugin);

export class StatisticsRepository extends Storage {
    #db;
    #statistics;

    async init(direction) {
        const db = await createRxDatabase({
            name: 'statistics_db',
            storage: getRxStorageDexie(),
        }).catch(err => console.log(err));
        const {statistics} = await db.addCollections({statistics: schema});
        this.#db = statistics;

        direction.subscribe((direction) => {
            document.querySelector('#statistics .card-content').classList.add('loader');
            const {source, target} = direction;
            this.#db.findOne({selector: {source, target}})
                .exec()
                .then(async doc => {
                    this.#statistics = doc || await this.#db.insert({source, target});
                    this.notify();

                    this.#statistics.$.subscribe(doc => {
                        this.#statistics = doc;
                        this.notify();
                    });

                    document.querySelector('#statistics .card-content').classList.remove('loader');
                });
        });
    }

    notify() {
        super.notify(this.#statistics.days.reduce((days, day) => ({...days, [day.localeDate]: {...day}}), {}));
    }

    subscribe(callback) {
        callback(this.#statistics);
        return super.subscribe(callback);
    }

    #save(key) {
        console.log(2, key)
        const days = this.#statistics.days.reduce((days, day) => ({...days, [day.localeDate]: {...day}}), {});
        const day = new Date().toLocaleDateString();

        if (!(day in days)) {
            days[day] = {localeDate: day, ...new DayStatistics()};
        }

        const dayStatistics = {...days[new Date().toLocaleDateString()]};
        days[new Date().toLocaleDateString()] = {...dayStatistics, [key]: ++dayStatistics[key]};

        this.#statistics.incrementalPatch({days: Object.values(days)});
    }

    addStarted = () => this.#save('started');
    addRepeated = () => this.#save('repeated');
    addCompleted = () => this.#save('completed');
    addWellKnown = () => this.#save('wellKnown');
}
