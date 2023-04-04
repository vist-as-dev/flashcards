import {ListItemFactory} from "./ListItemFactory";
import {ListenerWrapper} from "../../share/ListenerWrapper";
import {HideToggler} from "../../share/HideToggler";

export class WordListItem {
    constructor(dictionary, storage) {
        this.dictionary = dictionary;
        this.storage = storage;
        this.factory = new ListItemFactory();
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();
    }

    render(word, _title, subtitle, image) {
        const title = document.createElement('span');
        title.classList.add('title');
        title.innerHTML = _title;

        const label = document.createElement('p');
        label.innerHTML = `${subtitle}`;

        const wordImage = document.createElement('a');
        wordImage.setAttribute('href', '#modal-select-word-image');
        wordImage.classList.add('modal-trigger');
        wordImage.addEventListener('click', () => {
            const modal = document.querySelector('#modal-select-word-image');
            modal.setAttribute('data-query', word);
            modal.setAttribute('data-dictionary', this.dictionary?.id);
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

        const removeButton = this.factory.removeButton;
        const confirmButton = this.factory.confirmButton;
        const cancelButton = this.factory.cancelButton;

        removeButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([removeButton], [confirmButton, cancelButton]);
            });
        });

        confirmButton.addEventListener('click', (e) => {
            this.lw.listener(e, async () => {
                await this.storage.deleteWord(this.dictionary, word);

                M.Tooltip.getInstance(confirmButton).destroy();
                el.remove();
            });
        });

        cancelButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        const secondaryContent = document.createElement('span');
        secondaryContent.classList.add('secondary-content');
        secondaryContent.appendChild(removeButton);
        secondaryContent.appendChild(cancelButton);
        secondaryContent.appendChild(confirmButton);

        const el = this.factory.divItem;
        el.appendChild(wordImage);
        el.appendChild(title);
        el.appendChild(label);
        el.appendChild(secondaryContent);

        el.classList.add('avatar');

        el.addEventListener('blur', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        return el;
    }
}