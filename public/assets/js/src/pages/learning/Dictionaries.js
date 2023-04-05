
export class Dictionaries {
    constructor({storage: {dictionaries}}) {
        this.body = document.querySelector('div#learning div#addition #dictionary-list');
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
                <div class="row">
                    <div class="col s12">
                        <div class="switch">
                            <label class="truncate">
                                <input type="checkbox" id="${dictionary.id}" />
                                <span class="lever"></span>
                                ${dictionary.name}
                            </label>
                        </div>
                    </div>
                </div>
            `);

            this.body.innerHTML = items.join('\n');
        });
    }
}