import {Dictionary, Flashcard} from "../model";

export class SynchroService {
    #api;
    #synchroDictionary;
    #storageDictionary;
    #storageStatistics;

    init(api, synchroDictionary, storageDictionary, storageStatistics) {
        this.#api = api;
        this.#synchroDictionary = synchroDictionary;
        this.#storageDictionary = storageDictionary;
        this.#storageStatistics = storageStatistics;
    }

    async run() {
        for (const deleted of await this.#synchroDictionary.getDeleted()) {
            // deleted.gDriveFileId && await this.#api.deleteMetaFile(deleted.gDriveFileId).then(deleted.remove);
        }

        const localList = await this.#storageDictionary.all();
        for (const i in localList) {
            if (!localList[i].gDriveFileId) {
                const {gDriveFileId, flashcards, ...data} = {...localList[i], type: 'dictionary'};
                localList[i].gDriveFileId = await this.#api.createMetaFile(encodeURIComponent(data.name), data).then(({id}) => id);
                this.#storageDictionary.update(localList[i]);
            }
        }

        const files = await this.#api.listFiles({type: 'dictionary'});
        const remoteList = files.map(({id, properties}) => new Dictionary({
            gDriveFileId: id,
            ...properties,
        }));
        for (const i in remoteList) {
            remoteList[i].flashcards = await this.#api.downloadMetaFile(remoteList[i].gDriveFileId).then(cards => {
                for (const original in cards) {
                    const {word, step, ...data} = cards[original];
                    data.original = data.original || word;
                    data.status = data.status || step;
                    cards[original] = new Flashcard({...data});
                }
                return cards;
            });

            const dictionary = localList.find(({gDriveFileId}) => gDriveFileId === remoteList[i].gDriveFileId);
            if (!dictionary) {
                this.#storageDictionary.insert({...remoteList[i], flashcards: Object.values(remoteList[i].flashcards)});
                continue;
            }

            for (const original of await this.#synchroDictionary.getAddedFlashcards(dictionary.id)) {
                if (original in dictionary.flashcards) {
                    remoteList[i].flashcards[original] = {...dictionary.flashcards[original]};
                }
            }
            this.#synchroDictionary.resetAddedFlashcards(dictionary.id);

            for (const original of await this.#synchroDictionary.getDeletedFlashcards(dictionary.id)) {
                delete remoteList[i].flashcards[original];
            }
            this.#synchroDictionary.resetDeletedFlashcards(dictionary.id);

            for (const original in remoteList[i].flashcards) {
                if (!(original in dictionary.flashcards)) {
                    dictionary.flashcards[original] = remoteList[i].flashcards[original];
                }

                if (dictionary.flashcards[original].nextReview > remoteList[i].flashcards[original].nextReview) {
                    remoteList[i].flashcards[original] = {...dictionary.flashcards[original]};
                } else {
                    dictionary.flashcards[original] = {...remoteList[i].flashcards[original]};
                }
            }

            this.#storageDictionary.update(dictionary);

            const {flashcards, ...data} = {...remoteList[i], type: 'dictionary'};
            // await this.#api.updateMetaFileProperties(remoteList[i].gDriveFileId, data);
            // await this.#api.updateMetaFile(remoteList[i].gDriveFileId, remoteList[i].flashcards);
        }

        this.#api.listFiles({type: 'statistics'}).then(async (files) => {
            for (const file of files) {
                const data = await this.#api.downloadMetaFile(file.id).then(data => data || {});
                const local = await this.#storageStatistics.findOne({...file.properties});
                if (null !== local) {
                    for (const localeDate in data) {
                        for (const i in local.days) {
                            if (local.days[i].localeDate === localeDate) {
                                data[localeDate].started = Math.max(data[localeDate].started, local.days[i].started);
                                data[localeDate].repeated = Math.max(data[localeDate].repeated, local.days[i].repeated);
                                data[localeDate].completed = Math.max(data[localeDate].completed, local.days[i].completed);
                                data[localeDate].wellKnown = Math.max(data[localeDate].wellKnown, local.days[i].wellKnown);
                                local.days[i].started = Math.max(data[localeDate].started, local.days[i].started);
                                local.days[i].repeated = Math.max(data[localeDate].repeated, local.days[i].repeated);
                                local.days[i].completed = Math.max(data[localeDate].completed, local.days[i].completed);
                                local.days[i].wellKnown = Math.max(data[localeDate].wellKnown, local.days[i].wellKnown);
                            }
                        }
                    }
                    local.incrementalPatch({days: local.days});
                    await this.#api.updateMetaFile(file.id, data);
                }
            }
        });
    };
}