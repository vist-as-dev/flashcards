import {AddFormDictionary} from "./forms/AddFormDictionary";
import {DictionaryListItem} from "./DictionaryListItem";

export class DictionaryList {
    #dictionaries = {};

    #state;
    #active;

    #storage;
    #body;

    constructor({storage: {dictionary}}, state) {
        this.#body = document.querySelector('div#dictionaries .collection#dictionary-list .collection-body');
        this.#storage = dictionary;
        this.#state = state;

        this.#storage.subscribe((items) => {
            this.#dictionaries = items;

            if (Object.keys(this.#dictionaries).length === 0) {
                this.#setActive(null);
            }

            if (this.#active?.id in this.#dictionaries) {
                this.#setActive(this.#dictionaries[this.#active.id]);
            }

            if (Object.keys(this.#dictionaries).length > 0 && (!this.#active || !(this.#active.id in this.#dictionaries))) {
                this.#setActive(this.#dictionaries[Object.keys(this.#dictionaries).shift()]);
            }

            this.render();
        });

        this.#state.subscribe(({dictionary}) => this.#active = dictionary);

        new AddFormDictionary(this.#storage);
    }

    #setActive(dictionary) {
        this.#active = dictionary;
        this.#state.setState({dictionary});
    }

    render() {
        Object.values(this.#dictionaries).forEach(dictionary => {
            new DictionaryListItem(this.#body, {
                onClick: () => this.#setActive(dictionary),
                onDelete: () => this.#storage.delete(dictionary.id),
            }).render(dictionary);
        });

        [...this.#body.querySelectorAll('.collection-item')].forEach((el) => {
            if (!(el.dataset.id in this.#dictionaries)) {
                el.remove();
            }
        });

        const elems = this.#body.querySelectorAll('.tooltipped');
        M.Tooltip.init(elems);
    }
}