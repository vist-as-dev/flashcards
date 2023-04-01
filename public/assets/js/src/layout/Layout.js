import {Header} from "./Header";
import {NavTabs} from "./NavTabs";

export class Layout {
    constructor(container) {
        this.header = new Header(container);
        this.navigation = new NavTabs();
    }
}