const ids = ['introduction', 'preprocessing', 'download'];

const tabs = M.Tabs.init(document.querySelector('.tabs'), {
    onShow: () => {
        localStorage.setItem('index.tabs.active', ids[tabs.index]);
    },
});

function switchDownloadTab() {
    tabs.select('download')
}

document.addEventListener('DOMContentLoaded', function() {
    const active = localStorage.getItem('index.tabs.active');
    if (ids.includes(active)) {
        tabs.select(active);
    }
});