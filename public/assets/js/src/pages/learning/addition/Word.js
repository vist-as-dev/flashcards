import {TextToSpeechApi} from "../../../api";
import {Flashcard} from "../../../model";

const GALLERY_CALLBACK_KEY = 'addition.word'

export class Word {
    #body;

    #dictionaries = {};

    #storage;
    #state;
    #statistics;

    #word = [];

    constructor({storage: {dictionary, statistics}, imageGallery}, state) {
        this.#body = document.querySelector('div#learning div#addition [data-component="word"]');
        this.#storage = dictionary;
        this.#state = state;
        this.#statistics = statistics;

        this.#storage.subscribe((items) => {
            this.#dictionaries = items;
            this.render();
        });

        state.subscribe(({word, count}) => {
            this.#word = word;
            if (word.length === 0) {
                this.#body.classList.add('hide');
            } else {
                this.#body.classList.remove('hide');
            }

            document.querySelector('.tab a[href="#addition"] .badge').innerHTML = count;

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
            const [dictionaryId, {original}] = this.#word || [];
            this.#dictionaries[dictionaryId].flashcards[original].status = Flashcard.STATUS_WELL_KNOWN;
            this.#storage
                .update(this.#dictionaries[dictionaryId])
                .then(() => this.#statistics.addWellKnown())
            ;
        });

        this.#body.querySelector('[data-component="skip"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.#state.skip();
        });

        this.#body.querySelector('[data-component="add"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const [dictionaryId, {original}] = this.#word || [];
            this.#dictionaries[dictionaryId].flashcards[original].status = Flashcard.STATUS_IN_PROGRESS;
            this.#storage
                .update(this.#dictionaries[dictionaryId])
                .then(() => this.#statistics.addStarted())
            ;
        });

        this.#body.querySelector('[data-component="image-wrapper"]').addEventListener('click', () => {
            const [, {original, glossary}] = this.#word || [];

            const synonyms = Object.entries(glossary?.definitions || {})
                .reduce((set, [, definitions]) => {
                    definitions
                        .forEach(({synonyms}) => {
                            Object.values(synonyms).forEach(items => items.forEach(i => set.add(i)))
                        });
                    return set;
                }, new Set());

            const modal = document.querySelector('#modal-select-word-image');
            modal.setAttribute('data-query', original);
            modal.setAttribute('data-synonyms', [...synonyms].join('|'));
            modal.setAttribute('data-callback', GALLERY_CALLBACK_KEY);
        });

        imageGallery.addCallback(GALLERY_CALLBACK_KEY, (word, url) => {
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
            this.#dictionaries[dictionaryId].flashcards[word].image = url;
            this.#storage.update(this.#dictionaries[dictionaryId]);
        });
    }

    render() {
        const [, word] = this.#word || [];
        const image = this.#body.querySelector('[data-component="image-wrapper"] > img');
        const original = this.#body.querySelector('[data-component="original"]');
        const translations = this.#body.querySelector('[data-component="translations"]');
        const transliteration = this.#body.querySelector('[data-component="transliteration"]');
        const definitions = this.#body.querySelector('[data-component="definitions"]');
        const examples = this.#body.querySelector('[data-component="examples"]');

        image?.setAttribute('src', word?.image || 'assets/img/no-image.svg');

        original.innerHTML = word?.original || '';
        transliteration.innerHTML = word?.glossary?.transliteration || '';
        translations.innerHTML = word?.glossary?.translations || '';
        definitions.innerHTML = Object.entries(word?.glossary?.definitions || {})
            .map(([pos, definitions]) => {
                if (!Array.isArray(definitions)) {
                    definitions = [definitions];
                }

                return definitions
                    .map(({gloss, synonyms}) => {
                        return `<p class="flow-text"># ${gloss} <label>| ${pos}</label>${
                            Object.keys({...synonyms}).length > 0
                                ? `<label> | Synonyms: ${
                                    Object
                                        .entries({...synonyms})
                                        .map(([type, items]) => `<strong>${type}</strong>: ${Array.isArray(items) ? items.join(', ') : items}`)
                                        .join('; ')
                                }</label>`
                                : ''
                        }</p>`
                    })
                    .join('\n');
            })
            .join('\n');
        examples.innerHTML = '<p class="flow-text"> - ' + word?.glossary?.examples?.join('</p><p class="flow-text"> - ') + '</p>';
    }
}