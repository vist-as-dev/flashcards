import {Bootstrap} from "./bootstrap";
import {BingImageApi, GoogleDriveStorage, PexelImageApi, TranslateService} from "./api";
import {
    DirectionStorage,
    LanguageStorage,
    MediaStorage,
    StatisticsRepository,
    DictionaryRepository,
    SynchroDictionaryRepository
} from "./storage";
import {Layout} from "./layout";
import {Dictionaries, Flashcards, Introduction, Learning, Preprocessing} from "./pages";
import {ImageGallery} from "./components";
import {SynchroService} from "./service";

export class App {
    constructor(config) {
        new Bootstrap().init();

        this.api = {
            gDrive: new GoogleDriveStorage(),
            translate: new TranslateService(),
            bing: new BingImageApi(config),
        };

        this.storage = {
            direction: new DirectionStorage(),
            dictionary: new DictionaryRepository(),
            statistics: new StatisticsRepository(),
            languages: new LanguageStorage(),
            media: new MediaStorage(),
        }

        this.synchro = {
            service: new SynchroService(),
            dictionary: new SynchroDictionaryRepository(),
        }

        this.imageGallery = new ImageGallery(new PexelImageApi(config));
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
        await this.storage.statistics.init(this.storage.direction);

        await this.synchro.dictionary.init();
        await this.synchro.service.init(
            this.api.gDrive.meta,
            this.synchro.dictionary,
            this.storage.dictionary,
            this.storage.statistics,
        );

        await this.storage.media.init([
            '/assets/video/friends.s01e02.phrases.step1.mp4',
            '/assets/video/friends.s01e02.phrases.step2.mp4',
            '/assets/video/friends.s01e02.phrases.step3.mp4',
            '/assets/video/alice-in-wonderland.chapter4.step1.mp4',
            '/assets/video/alice-in-wonderland.chapter4.step2.mp4',
            '/assets/video/alice-in-wonderland.chapter4.step3.mp4',
            '/assets/video/my-words.march.step1.mp4',
            '/assets/video/my-words.march.step2.mp4',
            '/assets/video/my-words.march.step3.mp4',
        ]);
    }

    render() {
        this.pages.forEach(page => page.render());
    }
}