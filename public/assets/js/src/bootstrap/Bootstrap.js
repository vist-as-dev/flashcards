import {resize} from "./on-resize";

export class Bootstrap {
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            resize();

            const elems = document.querySelectorAll('.tooltipped');
            M.Tooltip.init(elems);
        });

        window.addEventListener('resize', resize, true);

        const source = document.querySelector('header select#source');
        const target = document.querySelector('header select#target');

        function expose() {
            if (source.value && target.value) {
                document.querySelector('header').classList.remove('hide');
                document.querySelector('main').classList.remove('hide');
                document.querySelector('footer').classList.remove('hide');
            } else {
                setTimeout(() => expose(), 500);
            }
        }

        expose();
    }
}