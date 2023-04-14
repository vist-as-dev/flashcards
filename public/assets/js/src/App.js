import {Bootstrap} from "./bootstrap";
import {BingImageApi, GoogleDriveStorage, PexelImageApi, TranslateService} from "./api";
import {LanguageStorage} from "./storage";
import {Layout} from "./layout";
import {Dictionaries, Flashcards, Introduction, Learning, Preprocessing} from "./pages";
import {DirectionStorage, DictionaryStorage, StatisticsStorage} from "./storage";
import {ImageGallery} from "./components";

export class App {
    constructor(config) {
        new Bootstrap().init();

        this.api = {
            gDrive: new GoogleDriveStorage(),
            translate: new TranslateService(),
            bing: new BingImageApi(config),
        };

        this.imageGallery = new ImageGallery(new PexelImageApi(config));

        const direction = new DirectionStorage();
        this.storage = {
            direction,
            dictionary: new DictionaryStorage(this.api.gDrive.meta, direction),
            statistics: new StatisticsStorage(this.api.gDrive.meta, direction),
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