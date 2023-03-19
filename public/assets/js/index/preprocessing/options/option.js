function PreprocessingOption(htmlId, storageKey, handle) {
    this.el = document.getElementById(htmlId);
    this.el.checked = localStorage.getItem(storageKey) === 'checked';

    this.save = () => { localStorage.setItem(storageKey, this.el.checked ? 'checked' : 'unchecked'); return this; }

    this.set = (value) => { this.el.checked = !!value; return this; }

    this.handle = (content) => {
        return this.el.checked ? handle(content) : content;
    }

    this.el.addEventListener('change', () => localStorage.setItem(storageKey, this.el.checked ? 'checked' : 'unchecked'));
}

splitToRows = (content) => {
    let rows = content.split('\r\n');

    if (rows.length === 1) {
        rows = content.split('\n');
    }

    if (rows.length === 1) {
        rows = content.split('\r');
    }

    return rows
}
