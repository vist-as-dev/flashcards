import {ListenerWrapper} from "../../../share/ListenerWrapper";
import {HideToggler} from "../../../share/HideToggler";

export class AddForm {
    #isOpen = false;

    constructor(selector) {
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();

        this.el = document.querySelector(selector);
        this.header = this.el.querySelector('.collection-header');
        this.addButton = this.header.querySelector('#add-btn');
        this.confirmButton = this.header.querySelector('#confirm-btn');
        this.cancelButton = this.header.querySelector('#cancel-btn');

        this.form = this.el.querySelector('.new');
        this.input = this.form.querySelector('input[type=text]');
        this.helperText = this.form.querySelector('.helper-text');
    }

    init(onSubmit) {
        this.input.addEventListener('input', (e) => {
            this.lw.listener(e, () => this.reset());
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                if (this.input.value.trim().length > 0) {
                    this.input.value = '';
                } else {
                    this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.addButton]);
                    this.#isOpen = false;
                }
                return;
            }
            if (e.keyCode !== 13 || this.input.value.trim().length === 0) {
                return;
            }
            this.lw.listener(e, () => this.process(onSubmit));
        });

        this.addButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([this.addButton], [this.form, this.confirmButton, this.cancelButton]);
                this.#isOpen = true;
                this.input.focus();

                this.cancelButton.onclick = (e) => {
                    this.lw.listener(e, () => {
                        this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.addButton]);
                        this.#isOpen = false;
                    });
                };

                this.confirmButton.onclick = (e) => {
                    if (this.input.value.trim().length === 0) {
                        return;
                    }
                    this.lw.listener(e, () => this.process(onSubmit));
                };
            });
        });
    }

    error(message) {
        this.helperText.innerHTML = message;
        this.ht.toggle([], [this.helperText]);
    }

    reset() {
        this.helperText.innerHTML = '';
        this.ht.toggle([this.helperText], []);
    }

    async process(handle) {
        this.form.classList.add('loader');
        try {
            await handle(this.input.value.trim());
            this.input.value = '';
            this.reset();
        } catch (e) {
            this.error(e.message);
        }
        this.form.classList.remove('loader');
    }

    toggle(isAvailable) {
        if (isAvailable) {
            this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.addButton]);
        } else {
            this.ht.toggle([this.form, this.confirmButton, this.cancelButton, this.addButton], []);
        }
    }
}
