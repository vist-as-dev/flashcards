export class ImageGallery {
    constructor(selector, onClick, api) {
        this.modalSelectWordImage = document.querySelector(selector);
        this.imageList = this.modalSelectWordImage.querySelector('#modal-select-word-image-list');
        this.queryInput = this.modalSelectWordImage.querySelector('#modal-word-image-query');
        this.queryInput.addEventListener('change', () => this.render());
        this.onClick = onClick;
        this.api = api;

        M.Modal.init(this.modalSelectWordImage, {
            onOpenStart: (modal) => {
                this.queryInput.value = modal.dataset.query;
                M.updateTextFields();
                this.render();
            }
        });
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
                        this.onClick && this.onClick(
                            {id: this.modalSelectWordImage.dataset.dictionary},
                            this.modalSelectWordImage.dataset.query,
                            url
                        );

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