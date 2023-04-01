import {AuthorisedDriveApiService} from "./AuthorisedDriveApiService.js";
import {StorageService} from "./StorageService.js";
import {MetaService} from "./MetaService.js";

export class GoogleDriveStorage {
    constructor() {
        const api = new AuthorisedDriveApiService();

        this.storage = new StorageService(api);
        this.meta = new MetaService(api);
    }
}
