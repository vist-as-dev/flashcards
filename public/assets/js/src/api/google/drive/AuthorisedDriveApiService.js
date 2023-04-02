import {DriveApiService} from "./DriveApiService.js";

export class AuthorisedDriveApiService {

    constructor() {
        this.apiService = new DriveApiService();
        this.isTokenLoading = false;
    }

    async authorized(callback, ...args) {
        while (this.isTokenLoading) {
            await (new Promise(resolve => setTimeout(resolve, 1000)));
        }

        return new Promise((resolve, reject) => {
            if (window.gapi && window.gapi.client.getToken() === null) {
                this.isTokenLoading = true;

                window.tokenClient.callback = (resp) => {
                    if (resp.error !== undefined) {
                        throw (resp);
                    }

                    this.isTokenLoading = false;

                    callback(...args).then(resolve).catch(reject);
                };

                // tokenClient.requestAccessToken({prompt: 'consent'});
                window.tokenClient.requestAccessToken();
            } else {
                callback(...args).then(resolve).catch(reject);
            }
        })
    }

    logout() {
        const token = window.gapi.client.getToken();
        if (token !== null) {
            window.google.accounts.oauth2.revoke(token.access_token);
            window.gapi.client.setToken('');
        }
    }

    async listFiles(params) {
        return this.authorized(this.apiService.listFiles.bind(this.apiService), params);
    }

    async createFile(name, mimeType, content, parent = 'root', properties = {}) {
        return this.authorized(this.apiService.createFile.bind(this.apiService), name, mimeType, content, parent, properties);
    }

    async updateFile(id, mimeType, content) {
        return this.authorized(this.apiService.updateFile.bind(this.apiService), id, mimeType, content);
    }

    async updateFileProperties(id, properties) {
        return this.authorized(this.apiService.updateFileProperties.bind(this.apiService), id, properties);
    }

    async getFileMeta(id) {
        return this.authorized(this.apiService.getFileMeta.bind(this.apiService), id);
    }

    async downloadFile(id) {
        return this.authorized(this.apiService.downloadFile.bind(this.apiService), id);
    }

    async deleteFile(id) {
        return this.authorized(this.apiService.deleteFile.bind(this.apiService), id);
    }

    async createFolder(name) {
        return this.authorized(this.apiService.createFolder.bind(this.apiService), name);
    }
}
