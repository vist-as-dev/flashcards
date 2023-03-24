export class MetaService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    async listFiles(properties = {}) {
        const query = [
            'trashed=false',
            ...Object.entries(properties).map(([key, value]) => `properties has {key='${key}' and value='${value}'}`),
        ].join(' and ');

        return this.apiService.listFiles({
            q: query,
            fields: 'files(id, name, properties)',
            orderBy: 'createdTime',
            spaces: 'appDataFolder',
        });
    }

    async createMetaFile(name, data) {
        return this.apiService.createFile(`${name}.json`, 'application/json', {}, 'appDataFolder', data);
    }

    async updateMetaFile(id, content) {
        return this.apiService.updateFile(id, 'application/json', content);
    }

    async getFileMeta(id) {
        return this.apiService.getFileMeta(id);
    }

    async updateMetaFileProperties(id, properties) {
        const {properties: oldProperties} = await this.getFileMeta(id);
        return this.apiService.updateFileProperties(id, { ...oldProperties, ...properties });
    }

    async downloadMetaFile(id) {
        const content = await this.apiService.downloadFile(id);
        return JSON.parse(content);
    }

    async deleteMetaFile(id) {
        await this.apiService.deleteFile(id);
    }
}
