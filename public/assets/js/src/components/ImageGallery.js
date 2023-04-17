export class ImageGallery {
    #callbacks = {}

    constructor(api) {
        this.modalSelectWordImage = document.querySelector('#modal-select-word-image');
        this.imageList = this.modalSelectWordImage.querySelector('#modal-select-word-image-list');
        this.queryInput = this.modalSelectWordImage.querySelector('#modal-word-image-query');
        this.queryInput.addEventListener('change', () => this.render());
        this.api = api;

        M.Modal.init(this.modalSelectWordImage, {
            onOpenStart: (modal) => {
                this.queryInput.value = modal.dataset.query;

                const synonyms = this.modalSelectWordImage.querySelector('[data-component="synonyms"]');
                synonyms.innerHTML = '';
                modal.dataset.synonyms.split('|').forEach(synonym => {
                    const el = document.createElement('a');
                    el.setAttribute('href', '#!');
                    el.innerHTML = synonym;
                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.queryInput.value = synonym;
                        this.render();
                    });
                    synonyms.appendChild(el);
                });

                M.updateTextFields();
                this.render();
            }
        });
    }

    addCallback(key, callback) {
        this.#callbacks[key] = callback;
    }

    render() {
        this.imageList.innerHTML = '';

        this.api
            .search(this.queryInput.value)
            .then(response => {
                response.forEach(({url, text}) => {
                    const img = document.createElement('img');
                    img.setAttribute('src', url);
                    img.setAttribute('alt', text);

                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay');
                    overlay.innerHTML = '<span>Select image</span>';
                    overlay.addEventListener('click', () => {
                        const onClick = this.#callbacks[this.modalSelectWordImage.dataset.callback];
                        onClick && onClick(this.modalSelectWordImage.dataset.query, url);

                        const instance = M.Modal.getInstance(this.modalSelectWordImage);
                        instance.close();
                    });

                    const li = document.createElement('li');
                    li.appendChild(img);
                    li.appendChild(overlay);

                    this.imageList.appendChild(li);
                });
            });
    }
}