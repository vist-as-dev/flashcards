import {Bootstrap} from "./bootstrap";
import {BingImageApi, GoogleDriveStorage, PexelImageApi, TranslateService} from "./api";
import {LanguageStorage} from "./storage";
import {Layout} from "./layout";
import {Dictionaries, Flashcards, Introduction, Learning, Preprocessing} from "./pages";
import {DirectionStorage, DictionaryStorage} from "./storage";

export class App {
    constructor(config) {
        new Bootstrap().init();

        this.api = {
            gDrive: new GoogleDriveStorage(),
            translate: new TranslateService(),
            pexel: new PexelImageApi(config),
            bing: new BingImageApi(config),
        };

        const direction = new DirectionStorage();
        this.storage = {
            direction,
            dictionary: new DictionaryStorage(this.api.gDrive.meta, direction),
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