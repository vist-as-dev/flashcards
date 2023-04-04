export class ImageGallery {
    constructor(selector, onClick) {
        this.modalSelectWordImage = document.querySelector(selector);
        this.imageList = this.modalSelectWordImage.querySelector('#modal-select-word-image-list');
        this.queryInput = this.modalSelectWordImage.querySelector('#modal-word-image-query');
        this.queryInput.addEventListener('change', () => this.render());
        this.onClick = onClick;

        M.Modal.init(this.modalSelectWordImage, {
            onOpenStart: (modal) => {
                this.imageList.innerHTML = '';
                this.queryInput.value = modal.dataset.query;
                M.updateTextFields();
                this.render();
            }
        });
    }

    render() {
        console.log(this.queryInput)
        this
            .upload(this.queryInput.value)
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

    upload(query) {
        return fetch('https://api.bing.microsoft.com/v7.0/images/search?' + new URLSearchParams({
            q: query,
            aspect: 'Square',
            color: 'ColorOnly',
            imageType: 'Photo',
            size: 'Large',
        }), {
            headers: {
                'Ocp-Apim-Subscription-Key': '1b4ab41c0e2a46a4aee257bacf68fd9a',
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                return response;
            })
            .then(({queryExpansions, relatedSearches, value}) => [
                ...(value || []).map(({contentUrl: url, name: text}) => ({url, text})),
                ...(queryExpansions || []).map(({thumbnail: {thumbnailUrl}, text}) => ({url: thumbnailUrl, text})),
                ...(relatedSearches || []).map(({thumbnail: {thumbnailUrl}, text}) => ({url: thumbnailUrl, text})),
            ])
            .then(response => response.filter(
                ({url}, index, array) => array.findIndex(i => i.url === url) === index)
            );
    }
}