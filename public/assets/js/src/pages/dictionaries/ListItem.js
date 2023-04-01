import {ListItemFactory} from "./ListItemFactory";
import {ListenerWrapper} from "../../share/ListenerWrapper";
import {HideToggler} from "../../share/HideToggler";

export class ListItem {
    constructor(storage) {
        this.storage = storage;
        this.factory = new ListItemFactory();
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();
    }

    render(type, {id, name, subtitle}) {
        const title = document.createElement('span');
        title.classList.add('title');
        title.innerHTML = name;

        const label = document.createElement('p');
        label.innerHTML = `${subtitle}`;

        const img = document.createElement('i');
        img.classList.add('material-icons', 'circle', 'green');
        img.innerHTML = 'insert_chart';

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

        const el = type === 'a' ? this.factory.aItem : this.factory.divItem;
        el.appendChild(img);
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
}