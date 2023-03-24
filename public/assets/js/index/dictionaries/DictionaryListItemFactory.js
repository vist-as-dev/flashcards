export class DictionaryListItemFactory {
    get element() {
        const el = document.createElement('a');
        el.classList.add('collection-item');
        el.href = '#';
        return el;
    }

    get button() {
        const el = document.createElement('i');
        el.classList.add('material-icons', 'right', 'tooltipped');
        return el;
    }

    get hideButton() {
        const el = this.button;
        el.classList.add('hide');
        return el;
    }

    get addButton() {
        const el = this.button;
        el.dataset = {position: 'right', tooltip: 'Add dictionary'};
        el.innerHTML = 'add';
        return el;
    }

    get removeButton() {
        const el = this.button;
        el.dataset = {position: 'right', tooltip: 'Remove'};
        el.innerHTML = 'remove';
        return el;
    }

    get confirmButton() {
        const el = this.hideButton;
        el.dataset = {position: 'left', tooltip: 'Confirm removing'};
        el.innerHTML = 'check';
        return el;
    }

    get cancelButton() {
        const el = this.hideButton;
        el.dataset = {position: 'right', tooltip: 'Cancel'};
        el.innerHTML = 'close';
        return el;
    }

    listener(e, callback) {
        e.stopPropagation();
        e.preventDefault();

        callback(e);
    }
}