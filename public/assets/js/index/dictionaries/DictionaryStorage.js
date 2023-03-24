export class DictionaryStorage {
    async list() {
        return new Promise((resolve, reject) => {
            GDrive.meta.listFiles({type: 'dictionary'}).catch(reject).then((files) => {
                resolve(files);
                // resolve(files.map(({id, properties: {name, source, target}}) => ({id, name, source, target})));
            });
        });
    }

    async get(id) {
        return GDrive.meta.getFileMeta(id);
    }

    async delete(id) {
        return GDrive.meta.deleteMetaFile(id);
    }

    async update(id, data) {
        return GDrive.meta.updateMetaFileProperties(id, data);
    }

    async create(name, source, target) {
        return GDrive.meta.createMetaFile(encodeURIComponent(name), {name, source, target, type: 'dictionary'});
    }
}
