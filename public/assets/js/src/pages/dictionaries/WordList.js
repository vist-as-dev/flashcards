import {WordListItem} from "./WordListItem";
import {AddForm} from "./AddForm";
import {WordStatus} from "../../service";
import {ImageGallery} from "../../components";

export class WordList {

    constructor(storage) {
        const collection = document.querySelector('div#dictionaries .collection#word-list');
        this.body = collection.querySelector('.collection-body');
        this.title = collection.querySelector('.collection-header h6');
        this.storage = storage;

        this.words = [];
        this.active = null;
        this.dictionary = null;

        const form = new AddForm('div#dictionaries .collection#word-list');
        form.init(async (name) => {
            if (this.isExists(name)) {
                form.error('Already exists');
                return;
            }

            await storage.addWords(this.dictionary, [name]);
            await this.render(this.dictionary);
        });

        const gallery = new ImageGallery('#modal-select-word-image', (dictionary, word, url) => {
            console.log({dictionary, word, url});
            storage.updateWord(dictionary, word, {image: url})
        });
    }

    async render(dictionary) {
        this.dictionary = dictionary;
        this.body.innerHTML = '';
        this.title.innerHTML = `${dictionary.name} <label>${dictionary.count || 0} items</label>`;
        this.words = await this.storage.words(dictionary.id);

        if (+dictionary.count !== Object.keys(this.words).length) {
            console.log('error');
        }
        if (+dictionary.count === 0) {
            return;
        }

        const item = new WordListItem(dictionary, this.storage);
        for (const [word, data] of Object.entries(this.words)) {
            const {step, glossary, image} = data;

            this.body.appendChild(item.render(
                word,
                this.getTitle(word, step),
                glossary?.translations || '-',
                image,
            ));
        }

        const elems = this.body.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    }

    isExists(word) {
        return word in this.words;
    }

    getTitle(name, step) {
        const {color, text} = WordStatus.getAttributes(step);

        return `
            <span class="tooltipped ${color}" data-tooltip="${text}" data-position="right">${name}</span>
            <label>| ${text}</label>
        `;
    }
}