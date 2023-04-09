
export class Dictionaries {
    #body;

    #dictionaries = {};

    #state;
    #activeDictionaries = [];

    constructor({storage: {dictionary}}, state) {
        this.#body = document.querySelector('div#learning div#addition [data-component="dictionaries"]');
        this.#state = state;

        dictionary.subscribe((items) => {
            this.#dictionaries = items;
            this.render();
        });

        state.subscribe(({dictionaries}) => {
            this.#activeDictionaries = dictionaries;
            this.render();
        });

        const elems = this.#body.closest('.col').querySelectorAll('.collapsible');
        M.Collapsible.init(elems);
    }

    render() {
        Object.values(this.#dictionaries).forEach(dictionary => {
            let el = this.#body.querySelector(`[data-id="${dictionary.id}"]`);
            if (el) {
                el.querySelector('span[data-name]').innerHTML = dictionary.name;
                return;
            }

            el = document.createElement('div');
            el.classList.add('input-field');
            el.setAttribute('data-id', dictionary.id);
            el.innerHTML = `
                    <div class="switch">
                        <label>
                            <input 
                                type="checkbox" 
                                data-id="${dictionary.id}" 
                                ${this.#activeDictionaries.includes(dictionary.id) && 'checked="checked"'} 
                            />
                            <span class="lever"></span>
                            <span data-name>${dictionary.name}</span>
                        </label>
                    </div>
            `;
            el.querySelector('[type="checkbox"]').addEventListener('change', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.#state.setDictionary(e.target.dataset.id, e.target.checked);
            });

            this.#body.prepend(el);
        });

        [...this.#body.querySelectorAll(`[data-id]`)].forEach(el => {
            if (!(el.dataset.id in this.#dictionaries)) {
                el.remove();
            }
        });
    }
}