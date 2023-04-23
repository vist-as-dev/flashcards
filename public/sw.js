const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
    '/',
    '/assets/css/materialize.min.css',
    '/assets/css/style.css',
    '/assets/css/themes/dark.css',
    '/assets/js/libs/google/analytics.js',
    '/assets/js/libs/xregexp/xregexp-all.js',
    '/assets/js/libs/materialize/materialize.min.js',
    '/assets/js/script.js',
    '/assets/img/no-image.svg',
    '/assets/video/friends.s01e02.phrases.step1.mp4',
    '/assets/video/friends.s01e02.phrases.step2.mp4',
    '/assets/video/friends.s01e02.phrases.step3.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step1.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step2.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step3.mp4',
    '/assets/video/my-words.march.step1.mp4',
    '/assets/video/my-words.march.step2.mp4',
    '/assets/video/my-words.march.step3.mp4',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/mstile-150x150.png',
    '/safari-pinned-tab.svg',
    '/site.webmanifest',
    // 'https://apis.google.com/js/api.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

const nonCacheable = [
    '/auth',
    '/auth/refresh',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://accounts.google.com/gsi/client',
    'https://apis.google.com',
];

const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(() => limitCacheSize(name, size));
            }
        });
    });
};

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets).catch(err => console.log(err));
        })
    );
});

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            const url = evt.request.url;
            // console.log(0, url)
            const isNonCacheable = nonCacheable.some(_url => url.startsWith(_url) || url.endsWith(_url))
                || url.startsWith('chrome-extension')
                || url.includes('extension')
                || !(url.indexOf('http') === 0)
                || evt.request.method !== 'GET';
            if (isNonCacheable) {
                return fetch(evt.request);
            }

            return caches.open(staticCacheName).then(cache => cache.keys().then(keys => {
                const isStatic = keys.some(key => key.url === evt.request.url);
                if (isStatic && cacheRes) {
                    return cacheRes;
                }

                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone()).catch(err => console.log(err));
                        limitCacheSize(dynamicCacheName, 300);
                        return fetchRes;
                    })
                }).catch(err => console.log(err));
            }));
        }).catch((err) => {
            console.log(err)
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html');
            }
        })
    );
});