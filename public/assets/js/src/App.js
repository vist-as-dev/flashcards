import {Bootstrap} from "./bootstrap";
import {GoogleDriveStorage, TranslateService} from "./api";
import {DictionaryStorage, LanguageStorage} from "./storage";
import {Layout} from "./layout";
import {Dictionaries, Flashcards, Introduction, Learning, Preprocessing} from "./pages";

export class App {
    constructor() {
        new Bootstrap().init();

        this.api = {
            gDrive: new GoogleDriveStorage(),
            translate: new TranslateService(),
        };

        this.storage = {
            dictionaries: new DictionaryStorage(this.api.gDrive.meta),
            languages: new LanguageStorage(),
        }

        this.navigation = new Layout(this).navigation;

        this.pages = [
            new Introduction(this),
            new Preprocessing(this),
            new Flashcards(this),
            new Dictionaries(this),
            new Learning(this),
        ];
    }

    render() {
        this.pages.forEach(page => page.render());
    }
}