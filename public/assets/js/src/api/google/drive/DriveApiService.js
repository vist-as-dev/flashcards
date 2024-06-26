export class DriveApiService {

    get api() {
        return window.gapi.client;
    }

    async listFiles(params) {
        const {result} = await this.api.drive.files.list(params);

        return result.files || [];
    }

    async createFile(name, mimeType, content, parent = 'root', properties = {}) {
        const form = new FormData();
        const metadata = {name, mimeType, parents: [parent], properties};
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', new Blob([content], {type: mimeType}));

        return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST',
            headers: new Headers({'Authorization': 'Bearer ' + gapi.auth.getToken().access_token}),
            body: form,
        }).then(response => response.json());
    }

    async updateFile(id, mimeType, content) {
        const {result} = await this.api.request({
            method: 'PATCH',
            path: `https://www.googleapis.com/upload/drive/v3/files/${id}`,
            params: {
                uploadType: 'media',
                fields: 'id',
            },
            headers: {
                'Content-Type': mimeType,
            },
            body: content,
        });

        return result;
    }

    async updateFileProperties(id, properties) {
        const {result} = await this.api.drive.files.update({
            fileId: id,
            resource: {
                properties,
            },
            fields: 'id',
        });

        return result;
    }

    async getFileMeta(id) {
        const {result} = await this.api.drive.files.get({
            fileId: id,
            fields: 'properties',
        });

        return result.properties || {};
    }

    async downloadFile(id) {
        const response = await this.api.drive.files.get({
            fileId: id,
            alt: 'media',
        });

        return response.body;
    }

    async deleteFile(id) {
        const {result} = await this.api.drive.files.delete({
            fileId: id,
        });

        return result;
    }

    async createFolder(name) {
        const {result} = await this.api.drive.files.create({
            resource: {
                name: name,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id'
        });

        return result;
    }
}
