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
        document.querySelector('header #synchro i').classList.add('icon-pulse');
        for (const deleted of await this.#synchroDictionary.getDeleted()) {
            deleted.gDriveFileId && await this.#api.deleteMetaFile(deleted.gDriveFileId).then(deleted.remove);
        }

        const localList = await this.#storageDictionary.all();
        for (const i in localList) {
            if (!localList[i].gDriveFileId) {
                const {gDriveFileId, flashcards, ...data} = {...localList[i], type: 'dictionary'};
                localList[i].gDriveFileId = await this.#api.createMetaFile(encodeURIComponent(data.name), data).then(({id}) => id);
                this.#storageDictionary.update(localList[i]);
                this.#api.updateMetaFile(localList[i].gDriveFileId, flashcards);
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
            await this.#api.updateMetaFileProperties(remoteList[i].gDriveFileId, data);
            await this.#api.updateMetaFile(remoteList[i].gDriveFileId, remoteList[i].flashcards);
        }

        const statisticsFiles = await this.#api.listFiles({type: 'statistics'});
        for (const index in statisticsFiles) {
            const data = await this.#api.downloadMetaFile(statisticsFiles[index].id).then(data => data || {});
            const local = await this.#storageStatistics.findOne({...statisticsFiles[index].properties});
            if (null === local) {
                await this.#storageStatistics.insert({...statisticsFiles[index].properties, days: data});
                continue;
            }

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

            for (const i in local.days) {
                if (!(local.days[i].localeDate in data)) {
                    data[local.days[i].localeDate] = local.days[i];
                }
            }

            statisticsFiles[index].days = data;

            local.incrementalPatch({days: local.days});
            await this.#api.updateMetaFile(statisticsFiles[index].id, data);
        }

        this.#storageStatistics.find().then(docs => {
            for (const doc of docs) {
                const isNew = !statisticsFiles.some(
                    ({property: {source, target}}) => source === doc.source && target === doc.target
                );

                if (isNew) {
                    this.#api.createMetaFile(
                        `statistics-${doc.source}-${doc.target}.json`,
                        {type: 'statistics', source: doc.source, target: doc.target}
                    ).then(({id}) => this.#api.updateMetaFile(
                        id,
                        doc.days.reduce((days, day) => ({...days, [day.localeDate]: {...day}}), {})
                    ));
                }
            }
        })

        document.querySelector('header #synchro i').classList.remove('icon-pulse');
    };
}