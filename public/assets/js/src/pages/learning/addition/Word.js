import {Word as Model} from '../../../model'
import {TextToSpeechApi} from "../../../api";
import {ImageGallery} from "../../../components";

export class Word {
    #body;

    #dictionaries = {};

    #state;
    #word = [];

    constructor({storage: {dictionary}, api: {pexel}}, state) {
        this.#body = document.querySelector('div#learning div#addition [data-component="word"]');
        this.#state = state;

        dictionary.subscribe((items) => {
            this.#dictionaries = items;
            this.render();
        });

        state.subscribe(({word}) => {
            this.#word = word;
            if (word.length === 0) {
                this.#body.classList.add('hide');
            } else {
                this.#body.classList.remove('hide');
            }
            this.render();
        });

        this.#body.querySelector('[data-component="original"]').addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await TextToSpeechApi.speech(e.target.innerText);
        });

        this.#body.querySelector('[data-component="well-known"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const [dictionaryId, {word}] = this.#word || [];
            this.#dictionaries[dictionaryId]?.words.update(word, {step: Model.STATUS_WELL_KNOWN});
        });

        this.#body.querySelector('[data-component="skip"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.#state.skip();
        });

        this.#body.querySelector('[data-component="add"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const [dictionaryId, {word}] = this.#word || [];
            this.#dictionaries[dictionaryId]?.words.update(word, {step: Model.STATUS_STARTED});
        });

        this.#body.querySelector('[data-component="image-wrapper"]').addEventListener('click', () => {
            const [, {word}] = this.#word || [];
            const modal = document.querySelector('#modal-select-word-image');
            modal.setAttribute('data-query', word);
        });

        new ImageGallery(
            '#modal-select-word-image',
            (word, url) => {
                fetch(url).then(() => {
                    const wrapper = this.#body.querySelector(`a[data-component="image-wrapper"]`);
                    const img = new Image();
                    img.classList.add('responsive-img');
                    img.setAttribute('data-component', 'image');
                    img.src = url;
                    img.alt = word;
                    wrapper.innerHTML = '';
                    wrapper.append(img);
                });

                const [dictionaryId] = this.#word || [];
                this.#dictionaries[dictionaryId]?.words.update(word, {image: url});
            },
            pexel
        );
    }

    render() {
        const [, word] = this.#word || [];
        const image = this.#body.querySelector('[data-component="image-wrapper"] > img');
        const original = this.#body.querySelector('[data-component="original"]');
        const translations = this.#body.querySelector('[data-component="translations"]');
        const transliteration = this.#body.querySelector('[data-component="transliteration"]');
        const definitions = this.#body.querySelector('[data-component="definitions"]');
        const examples = this.#body.querySelector('[data-component="examples"]');

        image?.setAttribute('src', word?.image);
        original.innerHTML = word?.word;
        transliteration.innerHTML = word?.glossary?.transliteration;
        translations.innerHTML = word?.glossary?.translations;
        definitions.innerHTML = Object.entries(word?.glossary?.definitions || {})
            .map(([pos, {gloss, synonyms}]) => {
                return `<p class="flow-text">${gloss} <label>| ${pos}</label>${synonyms && ('<label> | Synonyms: ' + synonyms + '</label>')}</p>`;
            })
            .join('\n');
        examples.innerHTML = '<p class="flow-text"> - ' + word?.glossary?.examples?.join('</p><p class="flow-text"> - ') + '</p>';
    }
}