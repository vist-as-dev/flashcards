const APP_DIR = 'flashcard.uno';

async function authorized(callback, ...args) {
    return new Promise((resolve, reject) => {
        if (gapi.client.getToken() === null) {
            tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    throw (resp);
                }

                callback(...args).then(resolve).catch(reject);
            };

            // tokenClient.requestAccessToken({prompt: 'consent'});
            tokenClient.requestAccessToken();
        } else {
            callback(...args).then(resolve).catch(reject);
        }
    })
}

const googleDriveMetaFiles = (properties = {}) => authorized(getMetaFiles, properties);
const googleDriveMetaUpload = (name, content, properties) => authorized(uploadMetaFile, name, 'application/json', JSON.stringify(content), properties);
const googleDriveMetaUpdate = (id, content) => authorized(updateFile, id, 'application/json', JSON.stringify(content));
const googleDriveMetaDownload = (id) => authorized(downloadMetaFile, id);
const googleDriveMetaDelete = (id) => authorized(deleteMetaFile, id);
const googleDriveUpload = (name, mimeType, content) => authorized(uploadFile, name, mimeType, content);

async function uploadMetaFile(name, mimeType, content, properties) {
    return createFile(name, mimeType, content, 'appDataFolder', properties);
}

async function uploadFile(name, mimeType, content) {
    return createFile(name, mimeType, content, await getApplicationDirectoryId());
}

function createFile(name, mimeType, content, parent, properties = {}) {
    const file = new Blob([content], {type: mimeType});
    const metadata = {
        'name': name,
        'mimeType': mimeType,
        'parents': [parent],
        'properties': properties,
    };

    const accessToken = gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => console.log(e);
        xhr.send(form);
    });
}

function updateFile(id, mimeType, content) {
    return new Promise((resolve, reject) => {
        fetch('https://www.googleapis.com/upload/drive/v3/files/' + id + '?uploadType=media&fields=id', {
            method: 'PATCH',
            headers: new Headers({
                Authorization: 'Bearer ' + gapi.auth.getToken().access_token,
                'Content-type': mimeType
            }),
            body: content
        }).then(response => response.json()).then(resolve).catch(reject)
    });
}

async function createFolder(name) {
    let response;
    try {
        response = await gapi.client.drive.files.create({
            resource: {
                name: name,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id'
        });
    } catch (err) {
        M.toast({html: err.message})
        return;
    }

    return response.result.id;
}

async function getApplicationDirectoryId() {
    let response;
    try {
        response = await gapi.client.drive.files.list({
            q: 'mimeType=\'application/vnd.google-apps.folder\' and name=\'' + APP_DIR + '\' and trashed=false',
            fields: 'files(id)',
            spaces: 'drive',
        });
    } catch (err) {
        M.toast({html: err.message})
        return null;
    }

    const {files} = response.result;

    return files.length > 0 ? files.shift().id : await createFolder(APP_DIR);
}

async function getMetaFiles(properties = {}) {
    const query = [
        'trashed=false',
        ...Object
            .entries(properties)
            .map(([key, value]) => 'properties has {key=\'' + key + '\' and value=\'' + value + '\'}')
    ].join(' and ');

    return new Promise((resolve, reject) => {
        gapi.client.drive.files.list({
            q: query,
            fields: 'files(id, name, properties)',
            orderBy: 'createdTime',
            spaces: 'appDataFolder',
        })
            .then(({result}) => resolve(result))
            .catch(reject)
    })
}

async function downloadMetaFile(id) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files.get({
            fileId: id,
            alt: 'media',
        })
            .then((response) => resolve(response.result || response.body))
            .catch(reject)
    })
}

async function deleteMetaFile(id) {
    return new Promise((resolve, reject) => {
        gapi.client.drive.files.delete({
            fileId: id,
        })
            .then((response) => resolve(response.result || response.body))
            .catch(reject)
    })
}
