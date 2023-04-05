export class PexelImageApi {
    constructor({PEXEL: {KEY}}) {
        this.key = KEY;
    }

    search(query, options = {}) {
        return fetch('https://api.pexels.com/v1/search?' + new URLSearchParams({
            query: query,
            orientation: 'portrait',
            per_page: 80,
            // size: 'small',
            ...options,
        }), {
            headers: {
                'Authorization': this.key,
            }
        })
            .then(response => response.json())
            // .then(response => {
            //     console.log(response);
            //     return response;
            // })
            .then(({photos}) => photos.map(({src}) => ({url: src?.medium, text: src?.alt})));
    }
}