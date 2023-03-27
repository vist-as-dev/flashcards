const ids = ['introduction', 'preprocessing', 'download', 'dictionaries', 'learning'];

let tabs;

function switchIntroductionTab() {
    tabs.select('introduction')
}

function switchPreprocessingTab() {
    tabs.select('preprocessing')
}

function switchDownloadTab() {
    tabs.select('download')
}

function switchDictionariesTab() {
    tabs.select('dictionaries')
}

function switchLearningTab() {
    tabs.select('learning')
}

document.addEventListener('DOMContentLoaded', function() {
    tabs = M.Tabs.init(document.querySelector('.tabs'), {
        onShow: () => {
            localStorage.setItem('index.tabs.active', ids[tabs.index]);
        },
    });

    const active = localStorage.getItem('index.tabs.active');
    if (ids.includes(active)) {
        tabs.select(active);
    }
});