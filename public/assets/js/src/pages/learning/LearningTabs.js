export class LearningTabs {
    static TAB_ADDITION = 'addition';
    static TAB_MEMORIZATION = 'memorization';
    static TAB_STATISTICS = 'statistics';

    tabs = [LearningTabs.TAB_ADDITION, LearningTabs.TAB_MEMORIZATION, LearningTabs.TAB_STATISTICS];
    instance

    constructor() {
        this.instance = M.Tabs.init(document.querySelector('div#learning .tabs'), {
            onShow: () => {
                localStorage.setItem('learning.tabs.active', this.tabs[this.instance.index]);
            },
        });

        const active = localStorage.getItem('learning.tabs.active');
        if (this.tabs.includes(active)) {
            this.instance.select(active);
            setTimeout(() => this.instance.updateTabIndicator(), 500);
        }
    }

    render() {
    }
}