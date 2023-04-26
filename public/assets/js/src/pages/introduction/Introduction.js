import {NavTabs} from "../../layout";

export class Introduction {
    #media;

    constructor({navigation, storage: {media}}) {
        document.addEventListener('DOMContentLoaded', () => {
            const elems = document.querySelectorAll('#introduction .modal');
            M.Modal.init(elems);
        });

        document.getElementById('redirectToPreprocessing').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            navigation.redirect(NavTabs.TAB_ID_PREPROCESSING);
        });

        this.#media = media;
        [
            ['#modal-introduction-video-subtitles-phrases-1 video', '/assets/video/friends.s01e02.phrases.step1.mp4'],
            ['#modal-introduction-video-subtitles-phrases-2 video', '/assets/video/friends.s01e02.phrases.step2.mp4'],
            ['#modal-introduction-video-subtitles-phrases-3 video', '/assets/video/friends.s01e02.phrases.step3.mp4'],
            ['#modal-introduction-video-book-words-1 video', '/assets/video/alice-in-wonderland.chapter4.step1.mp4'],
            ['#modal-introduction-video-book-words-2 video', '/assets/video/alice-in-wonderland.chapter4.step2.mp4'],
            ['#modal-introduction-video-book-words-3 video', '/assets/video/alice-in-wonderland.chapter4.step3.mp4'],
            ['#modal-introduction-video-my-words-1 video', '/assets/video/my-words.march.step1.mp4'],
            ['#modal-introduction-video-my-words-2 video', '/assets/video/my-words.march.step2.mp4'],
            ['#modal-introduction-video-my-words-3 video', '/assets/video/my-words.march.step3.mp4'],
        ].forEach(([selector, url]) => this.#videoSourceSubscribe(selector, url));
    }

    #videoSourceSubscribe(selector, url) {
        this.#media.subscribe(url, async blob => {
            if (blob) {
                const URL = window.URL || window.webkitURL;
                const src = URL.createObjectURL(blob);
                const el = document.querySelector(selector);

                el.setAttribute('src', src);
                el.setAttribute('type', blob.type);

                // URL.revokeObjectURL(src);
            }
        })
    }

    render() {
    }
}