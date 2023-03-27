import {DictionaryStorage} from "../dictionaries/DictionaryStorage.js";

document.addEventListener('DOMContentLoaded', () => {
    const storage = new DictionaryStorage();

    document
        .querySelector('div#download button#add-to-dictionary-btn')
        .addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const words = document
                .getElementById('sentences').value.split("\n")
                .filter(i => !!i.length)
                .filter((word, index, array) => array.indexOf(word) === index)
            ;
            const dictionaryId = document.getElementById('select-dictionary').value;

            for (const word1 of words) {
                await storage.createWord(word1, {id: dictionaryId});
            }
        });
});