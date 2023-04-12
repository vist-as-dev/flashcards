import {ListenerWrapper} from "../../share/ListenerWrapper";
import {HideToggler} from "../../share/HideToggler";

import {ListItemFactory} from "./ListItemFactory";
import {GALLERY_CALLBACK_KEY} from "./WordList";

export class WordListItem {
    #parent;
    #handlers;

    #factory;
    #lw;
    #ht;

    constructor(parent, {onDelete}) {
        this.#parent = parent;
        this.#handlers = {onDelete};

        this.#factory = new ListItemFactory();
        this.#lw = new ListenerWrapper();
        this.#ht = new HideToggler();
    }

    render(word, title, subtitle, image) {
        const label = document.createElement('p');
        label.innerHTML = `${subtitle}`;

        const wordImage = document.createElement('a');
        wordImage.setAttribute('href', '#modal-select-word-image');
        wordImage.classList.add('modal-trigger');
        wordImage.addEventListener('click', () => {
            const modal = document.querySelector('#modal-select-word-image');
            modal.setAttribute('data-query', word);
            modal.setAttribute('data-callback', GALLERY_CALLBACK_KEY);
        })

        const img = document.createElement(image ? 'img' : 'i');
        img.classList.add('circle');
        if (image) {
            img.setAttribute('src', image);
            img.setAttribute('alt', word);
        } else {
            img.classList.add('material-icons', 'green');
            img.innerHTML = 'insert_chart';
        }

        wordImage.appendChild(img);

        let el = this.#parent.querySelector(`.collection-item[data-word="${word}"]`);
        if (el) {
            el.querySelector('.title')?.replaceWith(title);
            el.querySelector('.title + p')?.replaceWith(label);
            el.querySelector('.modal-trigger')?.replaceWith(wordImage);
            return;
        }

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
                await this.#handlers.onDelete();

                M.Tooltip.getInstance(confirmButton).destroy();
                el.remove();
            });
        });

        cancelButton.addEventListener('click', (e) => {
            this.#lw.listener(e, () => {
                this.#ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        const secondaryContent = document.createElement('span');
        secondaryContent.classList.add('secondary-content');
        secondaryContent.appendChild(removeButton);
        secondaryContent.appendChild(cancelButton);
        secondaryContent.appendChild(confirmButton);

        el = this.#factory.divItem;
        el.appendChild(wordImage);
        el.appendChild(title);
        el.appendChild(label);
        el.appendChild(secondaryContent);

        el.classList.add('avatar');
        el.setAttribute('data-word', word);

        el.addEventListener('blur', (e) => {
            this.#lw.listener(e, () => {
                this.#ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        this.#parent.prepend(el);
    }
}