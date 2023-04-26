import {Bootstrap} from "./bootstrap";
import {BingImageApi, GoogleDriveStorage, PexelImageApi, TranslateService} from "./api";
import {LanguageStorage, MediaStorage} from "./storage";
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
            dictionary: new DictionaryStorage(),
            statistics: new StatisticsStorage(this.api.gDrive.meta, direction),
            languages: new LanguageStorage(),
            media: new MediaStorage([
                '/assets/video/friends.s01e02.phrases.step1.mp4',
                '/assets/video/friends.s01e02.phrases.step2.mp4',
                '/assets/video/friends.s01e02.phrases.step3.mp4',
                '/assets/video/alice-in-wonderland.chapter4.step1.mp4',
                '/assets/video/alice-in-wonderland.chapter4.step2.mp4',
                '/assets/video/alice-in-wonderland.chapter4.step3.mp4',
                '/assets/video/my-words.march.step1.mp4',
                '/assets/video/my-words.march.step2.mp4',
                '/assets/video/my-words.march.step3.mp4',
            ]),
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

    async init() {
        await this.storage.dictionary.init(this.storage.direction);
    }

    render() {
        this.pages.forEach(page => page.render());
    }
}