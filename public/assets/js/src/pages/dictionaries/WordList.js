import {WordStatus} from "../../service";
import {TextToSpeechApi} from "../../api";
import {Word} from "../../model";

import {AddFormWord} from "./forms/AddFormWord";
import {WordListItem} from "./WordListItem";

export const GALLERY_CALLBACK_KEY = 'dictionaries.wordList';

export class WordList {
    #body;
    #title;

    #dictionary = {};
    #words = {};
    #unsubscribe;
    #form;

    constructor({imageGallery}, state) {
        const collection = document.querySelector('div#dictionaries .collection#word-list');
        this.#body = collection.querySelector('.collection-body');
        this.#title = collection.querySelector('.collection-header h6');
        this.#form = new AddFormWord();

        state.subscribe(({dictionary}) => {
            this.#form.toggle(!!dictionary);

            if (!dictionary) {
                this.#words = {};
                document.querySelector('div#dictionaries .collection#dictionary-list').classList.remove('hide-on-small-and-down');
                document.querySelector('div#dictionaries .collection#word-list').classList.add('hide-on-small-and-down');
            } else {
                document.querySelector('div#dictionaries .collection#dictionary-list').classList.add('hide-on-small-and-down');
                document.querySelector('div#dictionaries .collection#word-list').classList.remove('hide-on-small-and-down');
            }

            if (this.#dictionary?.id !== dictionary?.id) {
                this.#unsubscribe && this.#unsubscribe();
                this.#unsubscribe = dictionary?.words?.subscribe(words => {
                    this.#words = words;
                    this.render();
                });
                this.#form.setStorage(dictionary?.words);
            }
            this.#dictionary = dictionary;
            this.render();
        });

        imageGallery.addCallback(GALLERY_CALLBACK_KEY, (word, url) => {
            const item = this.#body.querySelector(`[data-word="${word}"]`);
            if (item) {
                fetch(url).then(() => {
                    const wrapper = item.querySelector('a[href="#modal-select-word-image"]');
                    wrapper.innerHTML = '';

                    const img = new Image();
                    img.classList.add('circle');
                    img.src = url;
                    img.alt = word;

                    wrapper.appendChild(img);
                });
            }
            this.#dictionary?.words?.update(word, {image: url});
        });

        this.#title.closest('.collection-header').querySelector('#back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            state.setState({dictionary: null});
        })
    }

    render() {
        this.#title.innerHTML = `${this.#dictionary?.name || 'Words'} <label>${this.#dictionary?.count || 0} items</label>`;

        if (!this.#dictionary) {
            this.#body.innerHTML = '';
            return;
        }

        Object.values(this.#words).forEach(({word, step, glossary, image}) => {
            new WordListItem(this.#body, {onDelete: () => this.#dictionary?.words?.delete(word)})
                .render(
                    word,
                    this.getTitle(word, step, glossary?.transliteration),
                    glossary,
                    image,
                );
        });

        [...this.#body.querySelectorAll('.collection-item')].forEach((el) => {
            if (!(el.dataset.word in this.#words)) {
                el.remove();
            }
        });

        M.Tooltip.init(this.#body.querySelectorAll('.tooltipped'));
        M.Dropdown.init(this.#body.querySelectorAll('.dropdown-trigger'));
    }

    getTitle(name, step, transliteration) {
        const {color, text} = WordStatus.map[step] || WordStatus.map[Word.STATUS_NEW];

        const span = document.createElement('span');
        span.classList.add(...color.split(' '));
        span.innerHTML = name;

        const a = document.createElement('a');
        a.setAttribute('href', '#!');
        a.addEventListener('click', async e => {
            e.stopPropagation();
            e.preventDefault();
            await TextToSpeechApi.speech(name);
        });
        a.appendChild(span);

        const label = document.createElement('label');
        label.innerHTML = (transliteration && transliteration.length < 50 ? ' | ' + transliteration : '');

        const status = document.createElement('label');
        const dropDownId = `status-list-${encodeURIComponent(name)}`
        status.innerHTML = ` | 
            <a class='dropdown-trigger' href='#' data-target='${dropDownId}' style="width: 150px; display: inline-block">${text}</a>
        `;
        const dropdown = document.createElement('ul');
        dropdown.setAttribute('id', dropDownId);
        dropdown.classList.add('dropdown-content');
        dropdown.innerHTML = Object.entries(WordStatus.map).map(
            ([value, {text}]) => `<li><a href="#!" data-value="${value}">${text}</a></li>`
        ).join('\n');
        [...dropdown.querySelectorAll('[data-value]')].forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                (+el.dataset.value !== step) && this.#dictionary?.words?.update(name, {step: el.dataset.value})
            })
        });
        document.querySelector('div#dictionaries').appendChild(dropdown);

        const title = document.createElement('span');
        title.classList.add('title');
        title.append(a, label, status);

        return title;
    }
}
