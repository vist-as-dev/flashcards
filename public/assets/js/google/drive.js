const CLIENT_ID = '';
const API_KEY = '';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

const APP_DIR = 'flashcard.uno';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('upload-btn').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('upload-btn').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function googleDriveUpload(name, mimeType, content) {
    if (gapi.client.getToken() === null) {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }

            uploadFile(name, mimeType, content).then(() => M.toast({html: 'uploaded'}));
        };

        // tokenClient.requestAccessToken({prompt: 'consent'});
        tokenClient.requestAccessToken();
    } else {
        uploadFile(name, mimeType, content).then(() => M.toast({html: 'uploaded'}));
    }
}

async function uploadFile(name, mimeType, content) {
    let appDirId = await getApplicationDirectoryId();
    if (null === appDirId) {
        appDirId = await createFolder(APP_DIR);
    }

    createFile(name, mimeType, content, appDirId);
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
}

function createFile(name, mimeType, content, parent) {
    const file = new Blob([content], {type: mimeType});
    const metadata = {
        'name': name,
        'mimeType': mimeType,
        'parents': [parent],
    };

    const accessToken = gapi.auth.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    // xhr.onload = () => console.log(xhr.response.id);
    xhr.onerror = (e) => console.log(e);
    xhr.send(form);
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

    return files.length > 0 ? files.shift().id : null;
}
