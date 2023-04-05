import {App} from "./src/App";
import Config from "./config";


// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/cloud-platform';

let tokenClient;
let gapiInitiated = false;
let gisInitiated = false;

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

window.gapiLoaded = gapiLoaded;

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: Config.GAPI.KEY,
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
        client_id: Config.GAPI.CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });

    gisInitiated = true;
    checkBeforeStart();
}

window.gisLoaded = gisLoaded;

/**
 * Enables user interaction after all libraries are loaded.
 */
function checkBeforeStart() {
    if (gapiInitiated && gisInitiated) {
        window.tokenClient = tokenClient;
        window.gapi = gapi;
        window.google = google

        const app = new App(Config);
        app.render();
    }
}
