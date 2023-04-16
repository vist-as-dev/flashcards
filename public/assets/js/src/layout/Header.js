import {DirectionComponent} from "../components";

export class Header {
    constructor({storage: {languages}}) {
        this.direction = new DirectionComponent(
            'header select#source',
            'header.source',
            'header select#target',
            'header.target',
        );

        this.direction.init(languages);

        this.initTheme();

        document.querySelector('header #toggle-theme').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleTheme();
        });
    }

    initTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            const link = document.createElement('link');
            link.setAttribute('href', '/assets/css/themes/dark.css');
            link.setAttribute('rel', 'stylesheet');
            document.querySelector('head').appendChild(link);
        }
    }

    toggleTheme() {
        let link = document.querySelector('link[href="/assets/css/themes/dark.css"]');

        if (link) {
            link?.remove();
            localStorage.setItem('theme', 'light');
        } else {
            link = document.createElement('link');
            link.setAttribute('href', '/assets/css/themes/dark.css');
            link.setAttribute('rel', 'stylesheet');
            document.querySelector('head').appendChild(link);
            localStorage.setItem('theme', 'dark');
        }
    }
}