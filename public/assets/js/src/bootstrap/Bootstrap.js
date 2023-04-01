import {resize} from "./on-resize";

export class Bootstrap {
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            resize();

            const elems = document.querySelectorAll('.tooltipped');
            M.Tooltip.init(elems);
        });

        window.addEventListener('resize', resize, true);
    }
}