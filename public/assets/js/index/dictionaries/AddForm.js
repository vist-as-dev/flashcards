import {ListenerWrapper} from "../../share/ListenerWrapper.js";
import {HideToggler} from "../../share/HideToggler.js";

export class AddForm {
    constructor(selector) {
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();

        this.el = document.querySelector(selector);
        this.addButton = this.el.querySelector('#add-btn');

        this.form = this.el.querySelector('.new');
        this.input = this.form.querySelector('input[type=text]');
        this.helperText = this.form.querySelector('.helper-text');
        this.confirmButton = this.form.querySelector('#confirm-btn');
        this.cancelButton = this.form.querySelector('#cancel-btn');
    }

    init(onSubmit) {
        this.input.addEventListener('change', (e) => {
            this.lw.listener(e, () => {
                this.helperText.innerHTML = '';
                this.ht.toggle([this.helperText], []);
            });
        });

        this.addButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([this.addButton], [this.form]);
                this.input.focus();
            });
        });

        this.cancelButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([this.form], [this.addButton]);
            });
        });

        this.confirmButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                if (this.input.value.length === 0) {
                    return;
                }

                onSubmit(this.input.value);
                this.ht.toggle([this.form], [this.addButton]);
            });
        });
    }

    error(message) {
        this.helperText.innerHTML = message;
        this.ht.toggle([], [this.helperText]);
    }
}
