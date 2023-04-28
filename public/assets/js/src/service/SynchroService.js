import {Dictionary} from "../model";

export class SynchroService {
    #api;
    #synchroDictionary;
    #synchroStatistics;
    #storageDictionary;
    #storageStatistics;

    init(api, synchroDictionary, synchroStatistics, storageDictionary, storageStatistics) {
        this.#api = api;
        this.#synchroDictionary = synchroDictionary;
        this.#synchroStatistics = synchroStatistics;
        this.#storageDictionary = storageDictionary;
        this.#storageStatistics = storageStatistics;
    }

    async run() {
        const files = await this.#api.listFiles({type: 'dictionary'});
        const remoteList = files.map(({id, properties}) => new Dictionary({
            id: id,
            gDriveFileId: id,
            ...properties,
        }));
        for (const i in remoteList) {
            remoteList[i].flashcards = await this.#api.downloadMetaFile(remoteList[i].id);
        }

        const localList = await this.#storageDictionary.all();

        console.log(localList);
    };
}