export class Options {
    constructor() {
        const definitions = document.querySelector('input#definitions');
        const definitionExamples = document.querySelector('input#definition-examples');
        const definitionSynonyms = document.querySelector('input#definition-synonyms');
        const examples = document.querySelector('input#examples');
        const relatedWords = document.querySelector('input#related-words');
        const speechParts = document.querySelector('input#speech-parts');

        definitions.checked = localStorage.getItem('sentences.options.definitions') === 'checked';
        definitionExamples.checked = localStorage.getItem('sentences.options.definitionExamples') === 'checked';
        definitionSynonyms.checked = localStorage.getItem('sentences.options.definitionSynonyms') === 'checked';
        examples.checked = localStorage.getItem('sentences.options.examples') === 'checked';
        relatedWords.checked = localStorage.getItem('sentences.options.relatedWords') === 'checked';
        speechParts.checked = localStorage.getItem('sentences.options.speechParts') === 'checked';

        definitions.addEventListener("change", () => {
            localStorage.setItem('sentences.options.definitions', definitions.checked ? 'checked' : 'unchecked');
        });
        definitionExamples.addEventListener("input", () => {
            localStorage.setItem('sentences.options.definitionExamples', definitionExamples.checked ? 'checked' : 'unchecked');
        });
        definitionSynonyms.addEventListener("change", () => {
            localStorage.setItem('sentences.options.definitionSynonyms', definitionSynonyms.checked ? 'checked' : 'unchecked');
        });
        examples.addEventListener("change", () => {
            localStorage.setItem('sentences.options.examples', examples.checked ? 'checked' : 'unchecked');
        });
        relatedWords.addEventListener("change", () => {
            localStorage.setItem('sentences.options.relatedWords', relatedWords.checked ? 'checked' : 'unchecked');
        });
        speechParts.addEventListener("change", () => {
            localStorage.setItem('sentences.options.speechParts', relatedWords.checked ? 'checked' : 'unchecked');
        });
    }

    render() {
    }
}
