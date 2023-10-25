export class TranslateService {
    static translate(words, source, target) {
        return fetch('/api/translate', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                text: words,
                source: source,
                target: target,
                definitions: true,
                definition_examples: true,
                definition_synonyms: true,
                examples: true,
                related_words: false,
                speech_parts: false,
                format: 'json',
            }),
        })
            .then(response => response.json())
            .then(({content}) => content)
            .then(translates => translates.reduce(
                (result, translate) => ({...result, [translate.original]: translate}),
                {}
            ));
    }

    static setImage(original, image, source, target) {
        return fetch('/api/image', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({original, image, source, target}),
        });
    }
}