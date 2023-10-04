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
        document.querySelector('header #synchro i').classList.add('pulse');
        for (const deleted of await this.#synchroDictionary.getDeleted()) {
            deleted.gDriveFileId && await this.#api.deleteMetaFile(deleted.gDriveFileId).then(deleted.remove);
        }

        const localList = await this.#storageDictionary.all();
        for (const i in localList) {
            if (!localList[i].gDriveFileId) {
                const {gDriveFileId, flashcards, ...data} = {...localList[i], type: 'dictionary'};
                localList[i].gDriveFileId = await this.#api.createMetaFile(encodeURIComponent(data.name), data).then(({id}) => id);
                this.#storageDictionary.update(localList[i]);
                this.#api.updateMetaFile(localList[i].gDriveFileId, {...flashcards});
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
        }

        const images = {}
        for (const {flashcards} of remoteList) {
            for (const {original, image} of Object.values(flashcards)) {
                if (!(original in images) && image.length > 0) {
                    images[original] = image
                }
            }
        }

        for (const i in remoteList) {
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

                if (remoteList[i].flashcards[original].image.length === 0 && original in images) {
                    remoteList[i].flashcards[original].image = images[original];
                }

                if (dictionary.flashcards[original].image.length > 0 && remoteList[i].flashcards[original].image.length === 0) {
                    remoteList[i].flashcards[original].image = dictionary.flashcards[original].image;
                }

                if (dictionary.flashcards[original].image.length === 0 && remoteList[i].flashcards[original].image.length > 0) {
                    dictionary.flashcards[original].image = remoteList[i].flashcards[original].image;
                }

                if (dictionary.flashcards[original].status > remoteList[i].flashcards[original].status) {
                    remoteList[i].flashcards[original].status = dictionary.flashcards[original].status;
                } else {
                    dictionary.flashcards[original].status = remoteList[i].flashcards[original].status;
                }

                if (dictionary.flashcards[original].nextReview > remoteList[i].flashcards[original].nextReview) {
                    remoteList[i].flashcards[original].nextReview = dictionary.flashcards[original].nextReview;
                } else {
                    dictionary.flashcards[original].nextReview = remoteList[i].flashcards[original].nextReview;
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
                await this.#storageStatistics.insert({...statisticsFiles[index].properties, days: Object.values(data)});
                continue;
            }

            const days = [...local.days];
            for (const localeDate in data) {
                if (!days.some(day => day.localeDate === localeDate)) {
                    days.push({...data[localeDate], localeDate});
                    continue;
                }

                for (const i in days) {
                    if (days[i].localeDate === localeDate) {
                        data[localeDate].started = Math.max(data[localeDate].started, days[i].started);
                        data[localeDate].repeated = Math.max(data[localeDate].repeated, days[i].repeated);
                        data[localeDate].completed = Math.max(data[localeDate].completed, days[i].completed);
                        data[localeDate].wellKnown = Math.max(data[localeDate].wellKnown, days[i].wellKnown);
                        days[i] = {
                            ...days[i],
                            started: Math.max(data[localeDate].started, days[i].started),
                            repeated: Math.max(data[localeDate].repeated, days[i].repeated),
                            completed: Math.max(data[localeDate].completed, days[i].completed),
                            wellKnown: Math.max(data[localeDate].wellKnown, days[i].wellKnown),
                        };
                    }
                }
            }

            for (const i in days) {
                if (!(days[i].localeDate in data)) {
                    data[days[i].localeDate] = days[i];
                }
            }

            statisticsFiles[index].days = data;

            local.incrementalPatch({days});
            await this.#api.updateMetaFile(statisticsFiles[index].id, data);
        }

        this.#storageStatistics.find().then(docs => {
            for (const doc of docs) {
                const isNew = !statisticsFiles.some(
                    (file) => {
                        const {properties: {source, target}} = file;
                        return source === doc.source && target === doc.target;
                    }
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

        document.querySelector('header #synchro i').classList.remove('pulse');
    };
}