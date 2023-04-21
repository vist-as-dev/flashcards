import {Storage} from "./Storage";
import {Direction} from "../model/Direction";

export class DirectionStorage extends Storage {
    #direction = {};

    constructor() {
        super();

        this.#direction = new Direction();

        this.source = document.querySelector('header select#source');
        this.target = document.querySelector('header select#target');

        this.source.addEventListener('change', () => this.refresh());
        this.target.addEventListener('change', () => this.refresh());

        this.refresh();
    }

    refresh() {
        if (!this.source.value || !this.target.value) {
            setTimeout(() => this.refresh(), 1000);
            return;
        }

        this.#direction = new Direction({source: this.source.value, target: this.target.value});
        this.notify(this.#direction);
    }
}
