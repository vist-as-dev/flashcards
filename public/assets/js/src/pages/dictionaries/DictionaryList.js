import {DictionaryListItem} from "./DictionaryListItem";
import {WordList} from "./WordList";
import {AddForm} from "./AddForm";
import {FlashcardSelectDictionary} from "./FlashcardSelectDictionary";

export class DictionaryList {
    constructor({storage: {dictionaries}}) {
        this.body = document.querySelector('div#dictionaries .collection#dictionary-list .collection-body');
        this.storage = dictionaries;

        this.dictionaries = [];
        this.active = null;

        this.words = new WordList(this.storage);

        const form = new AddForm('div#dictionaries .collection#dictionary-list');
        form.init(async (name) => {
            if (this.isExists(name)) {
                form.error('Already exists');
                return;
            }

            const source = document.querySelector('header select#source');
            const target = document.querySelector('header select#target');

            await this.storage.create(name, source.value, target.value);
            await this.render();
        });
    }

    async render() {
        this.body.innerHTML = '';

        this.dictionaries = await this.storage.list();
        if (this.dictionaries.length === 0) {
            return;
        }

        const item = new DictionaryListItem(this.storage);
        this.dictionaries.forEach((dictionary) => this.body.appendChild(item.render(dictionary)));

        const elems = this.body.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);

        (new FlashcardSelectDictionary()).render(this.dictionaries);

        item.setAllOnCLickListener(
            [...this.body.querySelectorAll('.collection-item')],
            async (e) => {
                let el = e.target;
                if (!el.classList.contains('collection-item')) {
                    el = el.closest('.collection-item');
                }
                await this.setActive(el.dataset.id);
            },
        );

        this.body.querySelector('.collection-item').classList.add('active');
        await this.setActive(this.body.querySelector('.collection-item.active').dataset.id);
    }

    async setActive(id) {
        this.active = this.dictionaries.find((dictionary) => dictionary.id === id);
        await this.words.render(this.active);
    }

    isExists(name) {
        return this.dictionaries.some(dictionary => dictionary.name === name);
    }
}