import {DictionaryListItemFactory} from "./DictionaryListItemFactory.js";

export class DictionaryListItem {
    constructor(storage) {
        this.storage = storage;
        this.factory = new DictionaryListItemFactory();
    }

    renderAddDictionaryItem() {
        const el = this.factory.element;
        el.classList.add('new');
        el.innerHTML = 'Add dictionary';
        el.appendChild(this.factory.addButton);

        el.addEventListener('click', (e) => {
            this.factory.listener(e, () => {

            });
        });

        return el;
    }

    render(id, name) {
        const el = this.factory.element;
        el.innerHTML = name;

        const removeButton = this.factory.removeButton;
        const confirmButton = this.factory.confirmButton;
        const cancelButton = this.factory.cancelButton;

        removeButton.addEventListener('click', (e) => {
            this.factory.listener(e, () => {
                removeButton.classList.add('hide');
                confirmButton.classList.remove('hide');
                cancelButton.classList.remove('hide');
            });
        });

        confirmButton.addEventListener('click', (e) => {
            this.factory.listener(e, async () => {
                await this.storage.delete(id);

                el.remove();
            });
        });

        cancelButton.addEventListener('click', (e) => {
            this.factory.listener(e, () => {
                removeButton.classList.remove('hide');
                confirmButton.classList.add('hide');
                cancelButton.classList.add('hide');
            });
        });

        el.addEventListener('blur', (e) => {
            this.factory.listener(e, () => {
                removeButton.classList.remove('hide');
                confirmButton.classList.add('hide');
                cancelButton.classList.add('hide');
            });
        });

        el.appendChild(removeButton);
        el.appendChild(cancelButton);
        el.appendChild(confirmButton);

        return el;
    }
}