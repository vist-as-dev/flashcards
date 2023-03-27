export class TranslateService {
    translate(data) {
        return fetch('/api/translate', {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify(data),
        }).then(response => response.json()).then(({content}) => content);
    }
}