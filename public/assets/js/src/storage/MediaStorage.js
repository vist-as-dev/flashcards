import {addRxPlugin, createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";
import {RxDBDevModePlugin} from "rxdb/plugins/dev-mode";

addRxPlugin(RxDBDevModePlugin);

export class MediaStorage {
    #db;

    constructor(assets) {
        createRxDatabase({
            name: 'media_db',
            storage: getRxStorageDexie(),
        }).then(db => {
            this.#db = db;
            this.#db.addCollections({
                media: {
                    schema: {
                        title: 'media_db_schema',
                        version: 0,
                        primaryKey: 'url',
                        type: 'object',
                        properties: {
                            url: {type: 'string', maxLength: 200},
                            content: {type: 'string'},
                        },
                        required: ['url', 'blob'],
                    }
                }
            }).then(() => this.set(assets));
        });
    }

    set(assets) {
        if (Array.isArray(assets)) {
            assets.forEach(
                url => this.#db.media.findOne(url).exec().then(doc => {
                        !doc && fetch(url)
                            .then(response => response.blob())
                            .then(blob => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    this.#db.media.incrementalUpsert({url, content: reader.result});
                                }
                                reader.readAsDataURL(blob);
                            })
                    }
                )
            );
        }
    }

    get(url) {
        return this.#db.media.findOne(url).exec();
    }

    subscribe(url, callback) {
        if (!this.#db) {
            setTimeout(() => this.subscribe(url, callback), 100);
        } else {
            this.#db.media
                .findOne(url)
                .$
                .subscribe(async ({content}) => {
                    if (content) {
                        const blob = await fetch(content, false).then(response => response.blob());
                        callback(blob)
                    }
                });
        }
    }
}