import {ListenerWrapper} from "../../share/ListenerWrapper";
import {HideToggler} from "../../share/HideToggler";

import {ListItemFactory} from "./ListItemFactory";

export class DictionaryListItem {
    #parent = {};
    #dictionary = {};
    #handlers = {};

    #factory;
    #lw;
    #ht;

    constructor(parent, {onClick, onDelete}) {
        this.#parent = parent;
        this.#handlers = {onClick, onDelete};

        this.#factory = new ListItemFactory();
        this.#lw = new ListenerWrapper();
        this.#ht = new HideToggler();
    }

    get title() {
        const title = this.#factory.title;
        title.innerHTML = this.#dictionary.name;
        return title;
    }

    get label() {
        const label = document.createElement('p');
        label.innerHTML = `count: ${Object.keys(this.#dictionary.flashcards).length || 0}`;
        return label;
    }

    get avatar() {
        const avatar = document.createElement('i');
        avatar.classList.add('material-icons', 'circle');
        avatar.innerHTML = 'folder_open';
        return avatar;
    }

    get buttons() {
        const removeButton = this.#factory.removeButton;
        const confirmButton = this.#factory.confirmButton;
        const cancelButton = this.#factory.cancelButton;

        removeButton.addEventListener('click', (e) => {
            this.#lw.listener(e, () => {
                this.#ht.toggle([removeButton], [confirmButton, cancelButton]);
            });
        });

        confirmButton.addEventListener('click', (e) => {
            this.#lw.listener(e, async () => {
                this.#handlers.onDelete();

                M.Tooltip.getInstance(confirmButton).destroy();
            });
        });

        cancelButton.addEventListener('click', (e) => {
            this.#lw.listener(e, () => {
                this.#ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        return [removeButton, confirmButton, cancelButton];
    }

    render(dictionary) {
        if (!this.#dictionary.id) {
            this.#dictionary = dictionary;
        }

        let el = this.#parent.querySelector(`.collection-item[data-id="${dictionary.id}"]`);
        if (el) {
            el.querySelector('.title')?.replaceWith(this.title);
            el.querySelector('.title + p')?.replaceWith(this.label);
            el.querySelector('.circle')?.replaceWith(this.avatar);
            return;
        }

        const [removeButton, confirmButton, cancelButton] = this.buttons;
        const secondaryContent = document.createElement('span');
        secondaryContent.classList.add('secondary-content');
        secondaryContent.append(removeButton, cancelButton, confirmButton);

        el = this.#factory.aItem;
        el.appendChild(this.avatar);
        el.appendChild(this.title);
        el.appendChild(this.label);
        el.appendChild(secondaryContent);

        el.classList.add('avatar');
        el.setAttribute('data-id', dictionary.id);
        el.setAttribute('data-dictionary', dictionary.name);

        el.addEventListener('blur', (e) => {
            this.#lw.listener(e, () => {
                this.#ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        el.addEventListener('click', (e) => {
            this.#lw.listener(e, () => {
                [...this.#parent.querySelectorAll('.collection-item')].forEach(item => item.classList.remove('active'));
                el.classList.add('active');
                this.#handlers.onClick && this.#handlers.onClick(e);
            });
        });

        this.#parent.prepend(el);
    }
}