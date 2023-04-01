export class DictionaryStorage {
    constructor(api) {
        this.api = api;
    }

    async list() {
        return new Promise((resolve, reject) => {
            this.api.listFiles({type: 'dictionary'})
                .catch(reject)
                .then(files => files.reverse())
                .then((files) => {
                resolve(files.map(({id, properties}) => ({id, ...properties})));
            });
        });
    }

    async words(id, name = null) {
        return new Promise((resolve, reject) => {
            this.api.listFiles(
                {...{type: 'origin', dictionary: id}, ...(name ? {name} : {})})
                .catch(reject)
                .then(files => files.reverse())
                .then((files) => {
                    resolve(files.map(({id, properties}) => ({id, ...properties})));
                });
        });
    }

    async get(id) {
        return this.api.getFileMeta(id);
    }

    async delete(id) {
        const words = await this.words(id);
        words.forEach(({id}) => this.api.deleteMetaFile(id));

        return this.api.deleteMetaFile(id);
    }

    async update(id, data) {
        return this.api.updateMetaFileProperties(id, data);
    }

    async create(name, source, target) {
        return this.api.createMetaFile(encodeURIComponent(name), {name, source, target, type: 'dictionary'});
    }

    async createWord(name, dictionary) {
        name = this.escapeHtml(name);

        const words = await this.words(dictionary.id, name);
        if (words.length > 0) {
            return;
        }

        return this.api.createMetaFile(encodeURIComponent(name), {
            name,
            type: 'origin',
            dictionary: dictionary.id,
            step: 0,
            timestamp: Date.now(),
            image: '',
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;')
        ;
    }

    unescapeHtml(unsafe) {
        return unsafe
            .replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#039;', "'")
        ;
    }
}
