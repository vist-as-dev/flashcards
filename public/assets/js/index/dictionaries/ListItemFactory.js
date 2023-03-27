export class ListItemFactory {
    get aItem() {
        const el = document.createElement('a');
        el.classList.add('collection-item', 'waves-effect');
        el.href = '#';
        return el;
    }

    get divItem() {
        const el = document.createElement('div');
        el.classList.add('collection-item');
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
        el.setAttribute('data-position', 'right');
        el.setAttribute('data-tooltip', 'Add dictionary');
        el.innerHTML = 'add';
        return el;
    }

    get removeButton() {
        const el = this.button;
        el.setAttribute('data-position', 'right');
        el.setAttribute('data-tooltip', 'Remove');
        el.innerHTML = 'remove';
        return el;
    }

    get confirmButton() {
        const el = this.hideButton;
        el.setAttribute('data-position', 'left');
        el.setAttribute('data-tooltip', 'Confirm removing');
        el.innerHTML = 'check';
        return el;
    }

    get cancelButton() {
        const el = this.hideButton;
        el.setAttribute('data-position', 'right');
        el.setAttribute('data-tooltip', 'Cancel');
        el.innerHTML = 'close';
        return el;
    }
}