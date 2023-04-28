import {WordStatus} from "../../service";
import {TextToSpeechApi, TranslateService} from "../../api";

import {AddFormWord} from "./forms/AddFormWord";
import {WordListItem} from "./WordListItem";
import {Flashcard} from "../../model";

export const GALLERY_CALLBACK_KEY = 'dictionaries.wordList';

export class WordList {
    #body;
    #title;

    #dictionary = {};
    #storage;
    #synchro;
    #form;

    constructor({imageGallery, storage: {dictionary: storage}, synchro: {dictionary: synchro}}, state) {
        const collection = document.querySelector('div#dictionaries .collection#word-list');
        this.#body = collection.querySelector('.collection-body');
        this.#title = collection.querySelector('.collection-header h6');
        this.#storage = storage;
        this.#synchro = synchro;
        this.#form = new AddFormWord();

        state.subscribe(({dictionary}) => {
            this.#dictionary = dictionary;
            this.#form.toggle(!!dictionary);
            this.#form.init((text) => {
                if (text in this.#dictionary.flashcards) {
                    throw Error('Already exists');
                }

                this.#dictionary.flashcards[text] = new Flashcard({original: text});
                TranslateService.translate([text], this.#dictionary.source, this.#dictionary.target)
                    .then(translates => this.#dictionary.flashcards[text].glossary = translates[text])
                    .finally(() => this.#storage.update(this.#dictionary).then(
                        () => this.#synchro.saveAddedOriginals(this.#dictionary.id, [text])
                    ))
                ;
            });
            this.#toggle(!!dictionary);
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
            this.#dictionary && (this.#dictionary.flashcards[word].image = url);
            storage.update(this.#dictionary);
        });

        this.#title.closest('.collection-header').querySelector('#back-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            state.setState({dictionary: null});
        })
    }

    #toggle(dictionary) {
        if (!dictionary) {
            document.querySelector('div#dictionaries .collection#dictionary-list').classList.remove('hide-on-small-and-down');
            document.querySelector('div#dictionaries .collection#word-list').classList.add('hide-on-small-and-down');
        } else {
            document.querySelector('div#dictionaries .collection#dictionary-list').classList.add('hide-on-small-and-down');
            document.querySelector('div#dictionaries .collection#word-list').classList.remove('hide-on-small-and-down');
        }
    }

    render() {
        this.#title.innerHTML = `${this.#dictionary?.name || 'Words'} <label>${this.#dictionary?.count || 0} items</label>`;

        if (!this.#dictionary) {
            this.#body.innerHTML = '';
            return;
        }

        Object.values(this.#dictionary.flashcards).forEach(({original, status, glossary, image}) => {
            if (Object.keys(glossary || {}).length === 0) {
                TranslateService.translate([original], this.#dictionary.source, this.#dictionary.target)
                    .then(translates => {
                        this.#dictionary.flashcards[original].glossary = {...translates[original]};
                        this.#dictionary && this.#storage.update(this.#dictionary);
                    })
                ;
            }

            new WordListItem(this.#body, {
                onDelete: () => {
                    delete this.#dictionary.flashcards[original];
                    this.#storage
                        .update(this.#dictionary)
                        .then(() => this.#synchro.saveDeletedOriginal(this.#dictionary.id, [original]));
                }
            })
                .render(
                    original,
                    this.getTitle(original, status, glossary?.transliteration),
                    glossary,
                    image,
                );
        });

        [...this.#body.querySelectorAll('.collection-item')].forEach((el) => {
            if (!(el.dataset.word in this.#dictionary.flashcards)) {
                el.remove();
            }
        });

        M.Tooltip.init(this.#body.querySelectorAll('.tooltipped'));
        M.Dropdown.init(this.#body.querySelectorAll('.dropdown-trigger'));
    }

    getTitle(name, step, transliteration) {
        const {color, text} = WordStatus.map[step] || WordStatus.map[Flashcard.STATUS_NEW];

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
                if (+el.dataset.value !== step) {
                    this.#dictionary.flashcards[name].status = +el.dataset.value;
                    this.#storage.update(this.#dictionary);
                }
            })
        });
        document.querySelector('div#dictionaries').appendChild(dropdown);

        const title = document.createElement('span');
        title.classList.add('title');
        title.append(a, label, status);

        return title;
    }
}
