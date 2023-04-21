export class NavTabs {
    static TAB_ID_INTRODUCTION = 'introduction';
    static TAB_ID_PREPROCESSING = 'preprocessing';
    static TAB_ID_FLASHCARDS = 'flashcards';
    static TAB_ID_DICTIONARIES = 'dictionaries';
    static TAB_ID_LEARNING = 'learning';

    instance;

    constructor() {
        const pages = [
            NavTabs.TAB_ID_INTRODUCTION,
            NavTabs.TAB_ID_PREPROCESSING,
            NavTabs.TAB_ID_FLASHCARDS,
            NavTabs.TAB_ID_DICTIONARIES,
            NavTabs.TAB_ID_LEARNING,
        ];

        this.instance = M.Tabs.init(document.querySelector('footer .tabs'), {
            onShow: () => {
                localStorage.setItem('index.tabs.active', pages[this.instance.index]);
            },
        });

        const active = localStorage.getItem('index.tabs.active');
        if (pages.includes(active)) {
            this.instance.select(active);
            setTimeout(() => this.instance.updateTabIndicator(), 500);
        }
    }

    redirect(page) {
        this.instance.select(page);
        this.instance.updateTabIndicator();
    }
}
