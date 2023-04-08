export class Glossary {
    constructor(glossary) {
        this.definitions = glossary?.definitions || {};
        this.examples = glossary?.examples || [];
        this.original = glossary?.original || '';
        this.translations = glossary?.translations || '';
        this.transliteration = glossary?.transliteration || '';
    }
}