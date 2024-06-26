import {TextToSpeechApi} from "../../../api";
import {updateFlashcardByAnswerNew} from "../../../service";

const GALLERY_CALLBACK_KEY = 'memorization.word'

export class Word {
    #body;

    #dictionaries = {};

    #storage;
    #state;
    #statistics;

    #word = [];
    #choice = [];

    constructor({storage: {dictionary, statistics}, imageGallery}, state) {
        this.#body = document.querySelector('div#learning div#memorization [data-component="word"]');
        this.#storage = dictionary;
        this.#state = state;
        this.#statistics = statistics;

        this.#storage.subscribe((items) => {
            this.#dictionaries = items;
            this.render();
        });

        state.subscribe(({word, choice, count}) => {
            document.querySelector('.tab a[href="#memorization"] .badge').innerHTML = count;

            if (this.#word === word) {
                return;
            }

            this.#word = word;
            this.#choice = choice ? [choice[0] || '', choice[1] || '', choice[2] || '', choice[3] || '', choice[4] || '', choice[5] || ''] : ['', '', '', '', '', ''];

            if (word.length === 0) {
                this.#body.classList.add('hide');
            } else {
                this.#body.classList.remove('hide');
                this.reset();
            }
            this.render();
        });

        this.#body.querySelector('[data-component="original"]').addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await TextToSpeechApi.speech(e.target.innerText);
        });

        [...this.#body.querySelectorAll('[data-component="choice"] a.collection-item')].forEach(
            (el) => el.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const [, word] = this.#word;

                if (el.innerText === word?.original) {
                    this.toggle()
                    this.#body.querySelector('[data-component="success"]').classList.add('hide');
                    el.closest('.card-reveal').querySelector('.card-title').click();
                    [...el.closest('[data-component="choice"]').querySelectorAll('a.collection-item')].forEach(i => i.setAttribute('style', ''));
                } else {
                    el.setAttribute('style', `border: 1px solid red`);
                }
            })
        );

        this.#body.querySelector('.card-reveal .card-title').addEventListener('click', () => {
            const input = this.#body.querySelector('[data-component="input"]');
            let attempt = input.dataset.attempt ? +input.dataset.attempt : 3;
            input.setAttribute('data-attempt', --attempt);
            input.focus();
        });

        this.#body.querySelector('[data-component="prompt"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const [, {original}] = this.#word || [];
            const input = this.#body.querySelector('[data-component="input"]');
            input.focus();

            let value = input.value;
            [...original].some((letter, index) => {
                const a = letter.toLowerCase();
                const b = value[index]?.toLowerCase();
                if (a !== b) {
                    input.value = original.substring(0, index + (a !== ' ' ? 1 : 2));
                    return true;
                }
            });
        });

        this.#body.querySelector('[data-component="check"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const [, {original}] = this.#word || [];
            const input = this.#body.querySelector('[data-component="input"]');
            let attempt = input.dataset.attempt ? +input.dataset.attempt : 3;

            if (original.toLowerCase().trim() !== input.value.toLowerCase().trim()) {
                input.setAttribute('data-attempt', --attempt);
                input.classList.add('invalid');
                input.focus();

                switch (attempt) {
                    case 2:
                        e.target.querySelector('.material-icons').innerHTML = `looks_two`;
                        break;
                    case 1:
                        e.target.querySelector('.material-icons').innerHTML = `looks_one`;
                        break;
                    case 0:
                        e.target.querySelector('.material-icons').innerHTML = `looks_3`;
                        e.target.disabled = true;
                        break;
                }

                return;
            }

            input.classList.remove('invalid');
            this.toggle();

            if (attempt < 3) {
                this.#body.querySelector('[data-component="success"]').classList.add('hide');
            }
        });

        this.#body.querySelector('[data-component="input"]').addEventListener('keydown', (e) => {
            if (e.keyCode !== 13 || e.target.value.trim().length === 0) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();
            const [, {original}] = this.#word || [];
            const input = this.#body.querySelector('[data-component="input"]');
            let attempt = input.dataset.attempt ? +input.dataset.attempt : 3;

            if (original.toLowerCase().trim() !== input.value.toLowerCase().trim()) {
                input.setAttribute('data-attempt', --attempt);
                input.classList.add('invalid');
                input.focus();

                const btn = this.#body.querySelector('[data-component="check"]');
                switch (attempt) {
                    case 2:
                        btn.querySelector('.material-icons').innerHTML = `looks_two`;
                        break;
                    case 1:
                        btn.querySelector('.material-icons').innerHTML = `looks_one`;
                        break;
                    case 0:
                        btn.querySelector('.material-icons').innerHTML = `looks_3`;
                        btn.disabled = true;
                        break;
                }

                return;
            }

            input.classList.remove('invalid');
            this.toggle();

            this.#body.querySelector('[data-component="success"]').focus();
            if (attempt < 3) {
                this.#body.querySelector('[data-component="success"]').classList.add('hide');
                this.#body.querySelector('[data-component="skip"]').focus();
            }
        });

        this.#body.querySelector('[data-component="success"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const [dictionaryId, word] = this.#word || [];
            this.#dictionaries[dictionaryId].flashcards[word.original] = updateFlashcardByAnswerNew(word, true);
            this.#storage.update(this.#dictionaries[dictionaryId]);

            this.#dictionaries[dictionaryId].flashcards[word.original].repetitions > 12
                ? this.#statistics.addCompleted()
                : this.#statistics.addRepeated();

            const {nextReview} = this.#dictionaries[dictionaryId].flashcards[word.original];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(nextReview);
            M.toast({html: `<ul><li>origin: ${word.original}</li><li>next review: ${months[date.getMonth()]} ${date.getDate()}</li></ul>`});

            this.#state.skip();

            const input = this.#body.querySelector('[data-component="input"]');
            input.focus();
        });

        this.#body.querySelector('[data-component="skip"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const [dictionaryId, word] = this.#word || [];
            this.#dictionaries[dictionaryId].flashcards[word.original] = updateFlashcardByAnswerNew(word);
            this.#storage.update(this.#dictionaries[dictionaryId]);

            this.#state.skip();

            const input = this.#body.querySelector('[data-component="input"]');
            input.focus();
        });

        this.#body.querySelector('[data-component="failure"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const [dictionaryId, word] = this.#word || [];
            this.#dictionaries[dictionaryId].flashcards[word.original] = updateFlashcardByAnswerNew(word, false);
            this.#storage.update(this.#dictionaries[dictionaryId]);

            const {nextReview} = this.#dictionaries[dictionaryId].flashcards[word.original];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(nextReview);
            M.toast({html: `<ul><li>origin: ${word.original}</li><li>next review: ${months[date.getMonth()]} ${date.getDate()}</li></ul>`});

            this.#state.skip();

            const input = this.#body.querySelector('[data-component="input"]');
            input.focus();
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
        const repetitions = this.#body.querySelector('.card-image > .badge');
        const original = this.#body.querySelector('[data-component="original"]');
        const translations = this.#body.querySelector('[data-component="translations"]');
        const transliteration = this.#body.querySelector('[data-component="transliteration"]');
        const definitions = this.#body.querySelector('[data-component="definitions"]');
        const examples = this.#body.querySelector('[data-component="examples"]');
        const choice = this.#body.querySelector('[data-component="choice"]');

        if (image) {
            const isSenior = word?.repetitions > 6;
            image.setAttribute('src', isSenior ? 'assets/img/no-image.svg' : word?.image);
            image.style.width = isSenior ? "16px" : "auto";
            image.style.opacity = isSenior ? "0" : "1";
        }

        repetitions.innerHTML = word?.repetitions || 0;
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

        [...choice.querySelectorAll('a.collection-item')].forEach((el, i) => el.innerHTML = this.#choice[i]);
    }

    toggle(isOpen = true) {
        if (isOpen) {
            const [, {original}] = this.#word || [];
            TextToSpeechApi.speech(original);
        }
        [
            this.#body.querySelector('.input-field'),
            this.#body.querySelector('.buttons'),
            this.#body.querySelector('[data-component="choice"]'),
        ].forEach(el => isOpen ? el.classList.add('hide') : el.classList.remove('hide'));
        [
            this.#body.querySelector('.card-title'),
            this.#body.querySelector('[data-component="transliteration"]'),
            this.#body.querySelector('[data-component="examples"]'),
            this.#body.querySelector('[data-component="failure"]'),
            this.#body.querySelector('[data-component="success"]'),
        ].forEach(el => isOpen ? el.classList.remove('hide') : el.classList.add('hide'));
    }

    reset() {
        this.#body.querySelector('[data-component="input"]').value = '';
        this.#body.querySelector('[data-component="input"]').setAttribute('data-attempt', '3');
        this.#body.querySelector('[data-component="input"]').classList.remove('invalid');
        this.#body.querySelector('[data-component="input"]').focus();
        this.#body.querySelector('[data-component="check"]').disabled = false;
        this.#body.querySelector('[data-component="check"] .material-icons').innerHTML = `looks_3`;

        this.toggle(false);
    }
}