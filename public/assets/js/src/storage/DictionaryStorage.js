import {TranslateService} from "../api";

export class DictionaryStorage {
    constructor(api) {
        this.api = api;
    }

    list() {
        return this.api.listFiles({type: 'dictionary'})
            .then(files => files.reverse())
            .then((files) => files.map(({id, properties}) => ({id, ...properties})));
    }

    async words(id) {
        return await this.api.downloadMetaFile(id);
    }

    async get(id) {
        return this.api.getFileMeta(id);
    }

    async delete(id) {
        return this.api.deleteMetaFile(id);
    }

    async update(id, data) {
        return this.api.updateMetaFileProperties(id, data);
    }

    async create(name, source, target) {
        return this.api.createMetaFile(encodeURIComponent(name), {name, source, target, type: 'dictionary'});
    }

    async addWords(dictionary, newWords) {
        const words = await this.words(dictionary.id);
        const merged = newWords.reduce((map, word) => ({
            ...map,
            ...(word in map ? {} : {
                [word]: {
                    step: 0,
                    timestamp: Date.now(),
                    image: '',
                }
            })
        }), words);

        return this.api.updateMetaFile(dictionary.id, merged).then(() => {
            this.apiWordGlossary(newWords).then(glossary => {
                for (const word in merged) {
                    merged[word] = {...merged[word], ...(word in glossary ? {glossary: glossary[word]} : {})}
                }
                this.api.updateMetaFile(dictionary.id, merged);
            });
        });
    }

    async updateWord(dictionary, word, data = {}) {
        let words = await this.words(dictionary.id);
        words = {
            ...words,
            [word]: {
                ...(word in words ? words[word] : {}),
                ...data,
            }
        };

        return this.api.updateMetaFile(dictionary.id, words);
    }

    async deleteWord(dictionary, word) {
        let words = await this.words(dictionary.id);

        delete words[word];

        return this.api.updateMetaFile(dictionary.id, words);
    }

    async getWordTranslation(dictionary, word, data = {}) {
        if ('glossary' in data) {
            return data.glossary.translations;
        }

        let words = await this.words(dictionary.id);
        if (word in words) {
            if ('glossary' in words[word]) {
                return words[word].glossary.translations;
            }
        }

        const {[word]: glossary} = await this.apiWordGlossary([word]);

        if (word in words) {
            await this.updateWord(dictionary, word, {glossary});
        }

        return glossary?.translations;
    }

    async apiWordGlossary(words) {
        const source = document.querySelector('header select#source').value;
        const target = document.querySelector('header select#target').value;

        const translates = await (new TranslateService()).translate({
            text: words,
            source,
            target,
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
