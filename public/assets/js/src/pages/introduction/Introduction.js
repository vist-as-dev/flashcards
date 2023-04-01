import {NavTabs} from "../../layout";

export class Introduction {
    constructor({navigation}) {
        document.getElementById('redirectToPreprocessing').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            navigation.redirect(NavTabs.TAB_ID_PREPROCESSING);
        })
    }

    render() {
    }
}