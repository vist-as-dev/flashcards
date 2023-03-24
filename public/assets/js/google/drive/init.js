import {AuthorisedDriveApiService} from "./AuthorisedDriveApiService.js";
import {StorageService} from "./StorageService.js";
import {MetaService} from "./MetaService.js";

const api = new AuthorisedDriveApiService();
window.GDrive = {
    storage: new StorageService(api),
    meta: new MetaService(api)
};
