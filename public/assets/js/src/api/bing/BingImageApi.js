export class BingImageApi {
    constructor({BING: {KEY}}) {
        this.key = KEY;
    }

    search(query, options = {}) {
        return fetch('https://api.bing.microsoft.com/v7.0/images/search?' + new URLSearchParams({
            q: query,
            aspect: 'Square',
            color: 'ColorOnly',
            imageType: 'Photo',
            size: 'Large',
            ...options,
        }), {
            headers: {
                'Ocp-Apim-Subscription-Key': this.key,
            }
        })
            .then(response => response.json())
            // .then(response => {
            //     console.log(response);
            //     return response;
            // })
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