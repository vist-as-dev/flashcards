import {createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";

import {media as schema} from "./schemes";

export class MediaStorage {
    #db;

    async init(assets) {
        const db = await createRxDatabase({
            name: 'media_db',
            storage: getRxStorageDexie(),
        });
        const {media} = await db.addCollections({media: schema});
        this.#db = media;
        this.set(assets);
    }

    set(assets) {
        if (Array.isArray(assets)) {
            assets.forEach(
                url => this.#db.findOne(url).exec().then(doc => {
                        if (null === doc) {
                            fetch(url)
                                .then(response => response.blob())
                                .then(blob => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        this.#db.incrementalUpsert({url, content: reader.result});
                                    }
                                    reader.readAsDataURL(blob);
                                })
                            ;
                        }
                    }
                )
            );
        }
    }

    subscribe(url, callback) {
        this.#db.findOne(url).$.subscribe(async (doc) => {
            if (doc?.content) {
                fetch(doc.content)
                    .then(response => response.blob())
                    .then(callback)
                ;
            }
        });
    }
}