import {createRxDatabase} from "rxdb";
import {getRxStorageDexie} from "rxdb/plugins/storage-dexie";

import {media} from "./schemes";

export class MediaStorage {
    #db;

    constructor(assets) {
        createRxDatabase({
            name: 'media_db',
            storage: getRxStorageDexie(),
        }).then(db => {
            this.#db = db;
            this.#db.addCollections({media}).then(() => this.set(assets));
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

    subscribe(url, callback) {
        if (!this.#db?.media) {
            setTimeout(() => this.subscribe(url, callback), 100);
        } else {
            this.#db.media
                .findOne(url)
                .$
                .subscribe(async ({content}) => {
                    if (content) {
                        const blob = await fetch(content).then(response => response.blob());
                        callback(blob)
                    }
                });
        }
    }
}