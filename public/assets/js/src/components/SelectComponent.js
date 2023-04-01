export class SelectComponent {
    constructor(selector, storageKey) {
        this.el = document.querySelector(selector);
        this.key = storageKey;
    }

    render(options) {
        this.el.addEventListener("change", () => localStorage.setItem(this.key, this.el.value));

        const selected = localStorage.getItem(this.key);

        options.forEach(([value, label], i) => {
            const _selected = selected ? value === selected : i === 0;

            this.el.options.add(new Option(label, value, _selected, _selected));
        });

        M.FormSelect.init(this.el);
    }
}