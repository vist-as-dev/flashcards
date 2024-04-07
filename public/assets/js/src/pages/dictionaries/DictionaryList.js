import {ImportDictionaryForm} from "./forms/ImportDictionaryForm";
import {AddFormDictionary} from "./forms/AddFormDictionary";
import {DictionaryListItem} from "./DictionaryListItem";

export class DictionaryList {
    #dictionaries = {};

    #state;
    #active;

    #storage;
    #synchro;
    #body;

    constructor({storage: {dictionary}, synchro: {dictionary: synchro}}, state) {
        this.#body = document.querySelector('div#dictionaries .collection#dictionary-list .collection-body');
        this.#storage = dictionary;
        this.#synchro = synchro;
        this.#state = state;

        this.#storage.subscribe((items) => {
            this.#dictionaries = items;

            if (Object.keys(this.#dictionaries).length === 0) {
                this.#setActive(null);
            }

            if (this.#active?.id in this.#dictionaries) {
                this.#setActive(this.#dictionaries[this.#active.id]);
            }

            this.render();
        });

        this.#state.subscribe(({dictionary}) => this.#active = dictionary);

        new ImportDictionaryForm(this.#storage);
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
                onDelete: () => this.#storage.delete(dictionary).then(() => this.#synchro.delete(dictionary.id)),
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