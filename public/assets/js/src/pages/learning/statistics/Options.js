export class Options {
    #body;

    #state;

    constructor(state) {
        this.#body = document.querySelector('div#learning div#statistics [data-component="options"]');
        this.#state = state;

        [...this.#body.querySelectorAll('[name="period"]')].forEach(el => el.addEventListener('click', () => {
            this.#state?.setPeriod(el.value);
        }));

        [...this.#body.querySelectorAll('[data-component="types"] [type="checkbox"]')].forEach(el => el.addEventListener('click', () => {
            this.#state?.setTypes(el.name, el.checked);
        }));

        this.#state.subscribe(({period, types}) => {
            [...this.#body.querySelectorAll('[name="period"]')].forEach(el => el.checked = el.value === period);
            [...this.#body.querySelectorAll('[data-component="types"] [type="checkbox"]')].forEach(el => el.checked = types.includes(el.name));
        });

        const elems = this.#body.closest('.col').querySelectorAll('.collapsible');
        M.Collapsible.init(elems);
    }

    render() {

    }
}