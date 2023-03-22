const CLIENT_ID = '122698539028-cfhj5j86nff05gbi0mjv90p86cs5kuo5.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCfwJRn2yrms2raBzGRlHGo4e5M2axgpq8';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata';

let tokenClient;
let gapiInitiated = false;
let gisInitiated = false;

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
    gapiInitiated = true;
    checkBeforeStart();
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

    gisInitiated = true;
    checkBeforeStart();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function checkBeforeStart() {
    if (gapiInitiated && gisInitiated) {
        document.getElementById('upload-btn').classList.remove('hide');
    }
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
