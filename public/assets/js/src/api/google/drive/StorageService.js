export class StorageService {
    constructor(apiService) {
        this.apiService = apiService;
        this.appFolderName = 'flashcard.uno';
        this.appFolderId = null;
    }

    async upload(name, mimeType, content) {
        return this.apiService.createFile(name, mimeType, content, await this.getAppFolderId());
    }

    async getAppFolderId() {
        if (!this.appFolderId) {
            const folders = await this.apiService.listFiles({
                mimeType: 'application/vnd.google-apps.folder',
                q: `name='${this.appFolderName}' and trashed=false`,
                fields: 'files(id, name)',
                spaces: 'drive',
            });

            const [{id}] = folders.length > 0 ? folders : [await this.apiService.createFolder(this.appFolderName)];

            this.appFolderId = id;
        }
        return this.appFolderId;
    }
}
