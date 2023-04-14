import {Storage} from "./Storage";
import {DayStatistics} from "../model/DayStatistics";

export class StatisticsStorage extends Storage {
    #file = {};
    #statistics = {};
    #isLoaded = false;

    constructor(api, direction) {
        super();
        this.api = api;

        direction.subscribe((direction) => {
            this.#isLoaded = false;

            const {source, target} = direction;
            this.api.listFiles({type: 'statistics', source, target}).then(async ([file]) => {
                if (!file) {
                    file = await this.api.createMetaFile(
                        `statistics-${source}-${target}.json`,
                        {type: 'statistics', source, target}
                    );
                }

                this.#file = file;

                this.api.downloadMetaFile(file.id).then(data => {
                    this.#statistics = Object.keys(data || {}).length > 0
                        ? data
                        : {[new Date().toLocaleDateString()]: new DayStatistics()};
                    this.#isLoaded = true;
                    this.notify(this.#statistics);
                });
            });
        });
    }

    subscribe(callback) {
        this.#isLoaded && callback(this.#statistics);
        return super.subscribe(callback);
    }

    addStarted() {
        this.#statistics[new Date().toLocaleDateString()].started++;
        this.api.updateMetaFile(this.#file.id, this.#statistics);
        this.notify(this.#statistics);
    }

    addRepeated() {
        this.#statistics[new Date().toLocaleDateString()].repeated++;
        this.api.updateMetaFile(this.#file.id, this.#statistics);
        this.notify(this.#statistics);
    }

    addCompleted() {
        this.#statistics[new Date().toLocaleDateString()].completed++;
        this.api.updateMetaFile(this.#file.id, this.#statistics);
        this.notify(this.#statistics);
    }

    addWellKnown() {
        this.#statistics[new Date().toLocaleDateString()].wellKnown++;
        this.api.updateMetaFile(this.#file.id, this.#statistics);
        this.notify(this.#statistics);
    }
}
