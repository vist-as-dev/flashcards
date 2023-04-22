import {DriveApiService} from "./DriveApiService.js";
import {TokenService} from "../../../service/TokenService";

export class AuthorisedDriveApiService {

    constructor() {
        this.apiService = new DriveApiService();
    }

    async authorized(callback, ...args) {
        return new Promise((resolve, reject) => {
            callback(...args).then(resolve).catch(async (err) => {
                if ([401, 403].includes(err.status) && window.gapi) {
                    await TokenService.refreshToken();
                    callback(...args).then(resolve).catch(reject);
                } else {
                    reject(err);
                }
            });
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
