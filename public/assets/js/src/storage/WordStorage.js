import {TranslateService} from "../api";
import {Word, Glossary, Dictionary} from "../model";
import {Storage} from "./Storage";

export class WordStorage extends Storage {
    #items = {};
    #dictionary;
    #isLoaded = false;

    constructor(dictionary) {
        super();
        this.#dictionary = new Dictionary(dictionary);
    }

    subscribe(callback) {
        this.#isLoaded && callback(this.#items);
        return super.subscribe(callback);
    }

    filter(callback) {
        return Object.values(this.#items).filter(callback).reduce((words, word) => ({...words, [word.word]: word}), {});
    }

    set(words) {
        this.#items = Object.keys(words).reduce(
            (items, word) => ({...items, [word]: new Word({word, ...words[word]})}),
            {}
        );
        this.#isLoaded = true;
        this.notify(this.#items);
        return this;
    }

    add(newWords = []) {
        this.#items = newWords.reduce((map, word) => ({
            ...map,
            ...(word in map ? {} : {
                [word]: new Word({word})
            })
        }), this.#items);

        this.notify(this.#items);

        this.apiWordGlossary(newWords).then(glossary => {
            for (const word in this.#items) {
                this.#items[word].glossary = new Glossary({...(word in glossary ? glossary[word] : this.#items[word].glossary)});
            }
            this.notify(this.#items);
        });
    }

    update(word, data = {}) {
        if (('step' in data) && !('timestamp' in data)) {
            data = {...data, timestamp: Date.now()}
        }
        this.#items[word] = new Word({...this.#items[word], ...data});
        this.notify(this.#items);
    }

    delete(word) {
        delete this.#items[word];
        this.notify(this.#items);
    }

    async apiWordGlossary(words) {
        const translates = await (new TranslateService()).translate({
            text: words,
            source: this.#dictionary.source,
            target: this.#dictionary.target,
            definitions: true,
            definition_examples: true,
            definition_synonyms: true,
            examples: true,
            related_words: false,
            speech_parts: false,
            format: 'json',
        });

        return translates.reduce((result, translate) => ({
            ...result,
            [translate.original]: translate,
        }), {});
    }
}
