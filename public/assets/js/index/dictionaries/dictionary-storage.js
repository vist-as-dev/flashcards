async function getDictionaryList() {
    return new Promise((resolve, reject) => {
        googleDriveMetaFiles({type: 'dictionary'}).catch(reject).then(({files}) => {
            resolve(files.map(({id, properties: {name, source, target}}) => ({id, name, source, target})));
        });
    });
}

async function getDictionary(id) {
    return googleDriveMetaDownload(id);
}

async function deleteDictionary(id) {
    return googleDriveMetaDelete(id);
}

async function updateDictionary(id, content) {
    return googleDriveMetaUpdate(id, content);
}

async function createDictionary(name, source, target, content = {}) {
    return new Promise(
        (resolve, reject) => googleDriveMetaUpload(
            encodeURIComponent(name) + '.json',
            {name, source, target, type: 'dictionary'}
        ).catch(reject).then(resolve)
    );
}