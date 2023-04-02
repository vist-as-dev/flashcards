
export class Dictionaries {
    constructor({storage: {dictionaries}}) {
        this.body = document.querySelector('div#learning .collection#dictionary-list .collection-body');
        this.storage = dictionaries;
    }

    render() {
        this.body.innerHTML = '';

        this.storage.list().then(dictionaries => {
            this.dictionaries = dictionaries;
            if (this.dictionaries.length === 0) {
                return;
            }

            const items = this.dictionaries.map(dictionary => `
                <div class="collection-item avatar">
                    <span class="title">${dictionary.name}</span>
                </div>
            `);

            this.body.innerHTML = items.join('\n');
        });
    }
}