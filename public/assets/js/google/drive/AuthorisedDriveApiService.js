import {DriveApiService} from "./DriveApiService.js";

export class AuthorisedDriveApiService {

    constructor() {
        this.apiService = new DriveApiService();
    }

    async authorized(callback, ...args) {
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

    async listFiles(params) {
        return this.authorized(this.apiService.listFiles, params);
    }

    async createFile(name, mimeType, content, parent = 'root', properties = {}) {
        return this.authorized(this.apiService.createFile, name, mimeType, content, parent, properties);
    }

    async updateFile(id, mimeType, content) {
        return this.authorized(this.apiService.updateFile, id, mimeType, content);
    }

    async updateFileProperties(id, properties) {
        return this.authorized(this.apiService.updateFileProperties, id, properties);
    }

    async getFileMeta(id) {
        return this.authorized(this.apiService.getFileMeta, id);
    }

    async downloadFile(id) {
        return this.authorized(this.apiService.downloadFile, id);
    }

    async deleteFile(id) {
        return this.authorized(this.apiService.deleteFile, id);
    }

    async createFolder(name) {
        return this.authorized(this.apiService.createFolder, name);
    }
}
