import {ListItem} from "./ListItem.js";
import {AddForm} from "./AddForm.js";
import {TranslateService} from "../../service/api/TranslateService.js";

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

            await storage.createWord(name, this.dictionary);
            await this.render(this.dictionary);
        });
    }

    async render(dictionary) {
        this.dictionary = dictionary;
        this.title.innerHTML = dictionary.name;
        this.body.innerHTML = '';

        this.words = await this.storage.words(dictionary.id);
        if (this.words.length === 0) {
            return;
        }

        const source = document.querySelector('header select#source').value;
        const target = document.querySelector('header select#target').value;

        console.log(this.words.map(({name}) => this.storage.unescapeHtml(name)));

        const translates = await (new TranslateService()).translate({
            text: this.words.map(({name}) => this.storage.unescapeHtml(name)),
            source,
            target,
            definitions: true,
            definition_examples: true,
            definition_synonyms: true,
            examples: true,
            related_words: false,
            speech_parts: false,
            format: 'json',
        })

        console.log(translates)

        for (const i in this.words) {
            this.words[i].glossary = translates.find(
                ({original}) => original === this.storage.unescapeHtml(this.words[i].name)
            );
        }

        const item = new ListItem(this.storage);
        this.words.forEach((word) => this.body.appendChild(item.render('div', {
            ...word,
            name: this.getTitle(word),
            subtitle: word.glossary?.translations,
        })));

        const elems = this.body.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    }

    isExists(name) {
        return this.words.some(word => word.name === name);
    }

    getTitle({name, step}) {
        const map = {
            0: {color: 'deep-purple-text darken-1', text: 'new word'},
            1: {color: 'indigo-text darken-1', text: 'started learning'},
            2: {color: 'blue-text darken-1', text: 'first step completed'},
            3: {color: 'light-blue-text darken-1', text: 'second step completed'},
            4: {color: 'cyan-text darken-1', text: 'third step completed'},
            5: {color: 'teal-text darken-1', text: 'forth step completed'},
            6: {color: 'green-text darken-1', text: 'fifth step completed'},
            7: {color: 'grey-text darken-1', text: 'total completed'},
        }

        const {color, text} = map[step] || map[0];

        return `<span class="tooltipped ${color}" data-tooltip="${text}" data-position="right">${name}</span>`;
    }
}