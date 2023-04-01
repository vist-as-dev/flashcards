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
    }
}