const staticCacheName = 'static-v1';
const dynamicCacheName = 'dynamic-v1';
const assets = [
    '/',
    '/assets/css/materialize.min.css',
    '/assets/css/style.css',
    '/assets/css/themes/dark.css',
    '/assets/js/libs/google/analytics.js',
    '/assets/js/libs/xregexp/xregexp-all.js',
    '/assets/js/libs/materialize/materialize.min.js',
    // '/assets/js/script.js',
    '/assets/img/no-image.svg',
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
    '/auth/complete',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://accounts.google.com/gsi/client',
    'https://apis.google.com',
    '/assets/video/friends.s01e02.phrases.step1.mp4',
    '/assets/video/friends.s01e02.phrases.step2.mp4',
    '/assets/video/friends.s01e02.phrases.step3.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step1.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step2.mp4',
    '/assets/video/alice-in-wonderland.chapter4.step3.mp4',
    '/assets/video/my-words.march.step1.mp4',
    '/assets/video/my-words.march.step2.mp4',
    '/assets/video/my-words.march.step3.mp4',
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
    self.skipWaiting();
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
    const {request} = evt;
    const isNonCacheable = nonCacheable.some(url => request.url.startsWith(url) || request.url.endsWith(url))
        || request.url.startsWith('chrome-extension')
        || request.url.includes('extension')
        || !(request.url.indexOf('http') === 0)
        || request.method !== 'GET'
        || request.headers.has('range')
    ;
    if (isNonCacheable) {
        return null;
    } else {
        evt.respondWith(
            caches.match(request).then(cacheRes => {
                const isStatic = assets.some(url => request.url.startsWith(url) || request.url.endsWith(url));
                if (isStatic && cacheRes) {
                    return cacheRes;
                }

                return cacheRes || fetch(request).then(fetchRes => {
                    const fetchResClone = fetchRes.clone();
                    caches
                        .open(isStatic ? staticCacheName : dynamicCacheName)
                        .then(cache => {
                            cache.put(request, fetchResClone).catch(err => console.log(err));
                            !isStatic && limitCacheSize(dynamicCacheName, 100);
                        });

                    return fetchRes;
                });
            }).catch((err) => {
                console.log(err)
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
});