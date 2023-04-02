import {ListItemFactory} from "./ListItemFactory";
import {ListenerWrapper} from "../../share/ListenerWrapper";
import {HideToggler} from "../../share/HideToggler";

export class DictionaryListItem {
    constructor(storage) {
        this.storage = storage;
        this.factory = new ListItemFactory();
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();
    }

    render({id, name, subtitle}, onDelete) {
        const title = this.factory.title;
        title.innerHTML = name;

        const label = document.createElement('p');
        label.innerHTML = `${subtitle}`;

        const avatar = document.createElement('i');
        avatar.classList.add('material-icons', 'circle');
        avatar.innerHTML = 'folder_open';

        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('change', (e) => {
            this.lw.listener(e, () => {
                let list = localStorage.getItem('learning.dictionaries').split(', ');
                if (checkbox.checked && !list.includes(id)) {
                    list.push(id);
                }
                if (!checkbox.checked && list.includes(id)) {
                    list = list.filter(i => i !== id);
                }
                localStorage.setItem('learning.dictionaries', list.join(', '));
            });
        })

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
                await this.storage.delete(id);

                M.Tooltip.getInstance(confirmButton).destroy();
                el.remove();

                onDelete && onDelete()
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

        const el = this.factory.aItem;
        el.appendChild(avatar);
        el.appendChild(title);
        el.appendChild(label);
        el.appendChild(secondaryContent);

        el.classList.add('avatar');
        el.setAttribute('data-id', id);

        el.addEventListener('blur', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([confirmButton, cancelButton], [removeButton]);
            });
        });

        return el;
    }

    setAllOnCLickListener(items, callback) {
        items.forEach((item) => {
            item.addEventListener('click', (e) => {
                this.lw.listener(e, () => {
                    items.forEach((item) => {
                        item.classList.remove('active');
                    });
                    item.classList.add('active');
                    callback && callback(e);
                });
            });
        });
    }
}