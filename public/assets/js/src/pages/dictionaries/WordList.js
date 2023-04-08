import {WordStatus} from "../../service";
import {ImageGallery} from "../../components";
import {TextToSpeechApi} from "../../api";

import {AddFormWord} from "./forms/AddFormWord";
import {WordListItem} from "./WordListItem";

export class WordList {
    #body;
    #title;

    #dictionary = {};
    #words = {};
    #unsubscribe;
    #form;

    constructor({api: {pexel}}, state) {
        const collection = document.querySelector('div#dictionaries .collection#word-list');
        this.#body = collection.querySelector('.collection-body');
        this.#title = collection.querySelector('.collection-header h6');
        this.#form = new AddFormWord();

        state.subscribe(({dictionary}) => {
            if (this.#dictionary?.id !== dictionary?.id) {
                this.#unsubscribe && this.#unsubscribe();
                this.#unsubscribe = dictionary.words?.subscribe(words => {
                    this.#words = words;
                    this.render();
                });
                this.#form.setStorage(dictionary.words);
            }
            this.#dictionary = dictionary;
            this.render();
        });

        new ImageGallery(
            '#modal-select-word-image',
            (word, url) => {
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
            },
            pexel
        );
    }

    render() {
        this.#title.innerHTML = `${this.#dictionary?.name || 'Words'} <label>${this.#dictionary?.count || 0} items</label>`;

        Object.values(this.#words).forEach(({word, step, glossary, image}) => {
            new WordListItem(this.#body, {onDelete: () => this.#dictionary?.words?.delete(word)})
                .render(
                    word,
                    this.getTitle(word, step, glossary?.transliteration),
                    glossary?.translations || 'translation in progress...',
                    image,
                );
        });

        [...this.#body.querySelectorAll('.collection-item')].forEach((el) => {
            if (!(el.dataset.word in this.#words)) {
                el.remove();
            }
        });

        const elems = this.#body.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    }

    getTitle(name, step, transliteration) {
        const {color, text} = WordStatus.getAttributes(step);

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
        label.innerHTML = (transliteration && transliteration.length < 50 ? ' | ' + transliteration : '') + ' | ' + text;

        const title = document.createElement('span');
        title.classList.add('title');
        title.append(a, label);

        return title;
    }
}