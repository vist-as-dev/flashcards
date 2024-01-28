import {ListenerWrapper} from "../../../share/ListenerWrapper";
import {HideToggler} from "../../../share/HideToggler";
import {Dictionary} from "../../../model";

export class ImportDictionaryForm {
    #dictionaries = {};
    #isOpen = false;

    constructor(storage) {
        this.lw = new ListenerWrapper();
        this.ht = new HideToggler();

        this.el = document.querySelector('div#dictionaries .collection#dictionary-list');
        this.header = this.el.querySelector('.collection-header');
        this.importButton = this.header.querySelector('#import-btn');
        this.addButton = this.header.querySelector('#add-btn');
        this.confirmButton = this.header.querySelector('#confirm-btn');
        this.cancelButton = this.header.querySelector('#cancel-btn');

        this.form = this.el.querySelector('.import');
        this.input = this.form.querySelector('input[type=text]');
        this.file = this.form.querySelector('input[type=file]');
        this.helperText = this.form.querySelector('.helper-text');

        storage.subscribe(dictionaries => this.#dictionaries = dictionaries);

        this.init(async (imported) => {
            if (Object.values(this.#dictionaries).some(dictionary => dictionary.name === imported.name)) {
                const body = document.querySelector('div#dictionaries .collection#dictionary-list .collection-body');
                const item = body.querySelector(`[data-dictionary="${name}"]`);
                body.removeChild(body.querySelector(`[data-dictionary="${name}"]`));
                body.prepend(item);
                item.classList.add('pulse');
                setTimeout(() => item.classList.remove('pulse'), 1000);

                throw Error('Already exists');
            }

            await storage.insert(imported);
        });
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
                    this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.importButton, this.addButton]);
                    this.#isOpen = false;
                }
                return;
            }
            if (e.keyCode !== 13 || this.input.value.trim().length === 0) {
                return;
            }
            this.lw.listener(e, () => this.process(onSubmit));
        });

        this.importButton.addEventListener('click', (e) => {
            this.lw.listener(e, () => {
                this.ht.toggle([this.importButton, this.addButton], [this.form, this.confirmButton, this.cancelButton]);
                this.#isOpen = true;
                this.input.focus();

                this.cancelButton.onclick = (e) => {
                    this.lw.listener(e, () => {
                        this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.importButton, this.addButton]);
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
        try {
            const name = this.input.value.trim();
            const [file] = this.file.files;
            const maxSize = 7 * 1024 * 1024;
            if (file) {
                if (!name || file.size > maxSize) {
                    return
                }

                this.form.classList.add('loader');

                const reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt) => {
                    let content = evt.target.result;
                    try {
                        content = JSON.parse(content)
                        if ('gDriveFileId' in content) {
                            delete content.gDriveFileId
                        }
                        if ('id' in content) {
                            delete content.id
                        }
                        if ('name' in content) {
                            delete content.gDriveFileId
                        }
                        const flashcards = []
                        if ('flashcards' in content) {
                            for (const origin in content.flashcards) {
                                content.flashcards[origin].status = 0
                                content.flashcards[origin].interval = 1
                                content.flashcards[origin].easeFactor = 0
                                content.flashcards[origin].repetitions = 0
                                content.flashcards[origin].nextReview = Date.now()

                                flashcards.push(content.flashcards[origin])
                            }
                        }

                        handle(new Dictionary({...content, name, flashcards}))
                    } catch (e) {
                        console.log(e)
                    }
                }
                reader.onerror = function (evt) {
                    console.log(evt)
                }
            }

            this.input.value = '';
            this.reset();
        } catch (e) {
            this.error(e.message);
        }
        this.form.classList.remove('loader');
    }

    toggle(isAvailable) {
        if (isAvailable) {
            this.ht.toggle([this.form, this.confirmButton, this.cancelButton], [this.importButton, this.addButton]);
        } else {
            this.ht.toggle([this.form, this.confirmButton, this.cancelButton, this.importButton, this.addButton], []);
        }
    }
}
