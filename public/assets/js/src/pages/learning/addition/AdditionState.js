import {State} from "../../../storage";
import {Flashcard} from "../../../model";

const STORAGE_KEY = 'addition.dictionaries';

export class AdditionState extends State{
    #direction = {};
    #dictionaries = {};
    #set = [];
    #count = 0;

    constructor({storage: {direction, dictionary}}) {
        super({
            dictionaries: [],
            word: [],
            count: 0,
        });

        direction.subscribe(direction => {
            this.#direction = direction;
            this.#setState();
        });

        dictionary.subscribe(dictionaries => {
            this.#dictionaries = dictionaries;
            this.#setState();
        })
    }

    #setState() {
        this.setState({
            dictionaries: this.#activeDictionaries,
            word: this.#word,
            count: this.#count,
        });
    }

    get #activeDictionaries() {
        const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const key = this.#direction.source + '-' + this.#direction.target;
        return store[key] || [];
    }

    setDictionary(id, checked) {
        const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const key = this.#direction.source + '-' + this.#direction.target;

        let list = store[key] || [];
        list = checked ? [...list, id] : list.filter(i => i !== id);
        store[key] = Array.from(new Set(list));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        this.#setState();
    }

    get #word() {
        const getNew = dictionary => Object.entries(dictionary?.flashcards || {}).reduce((news, [key, card]) => {
            if (card.status === Flashcard.STATUS_NEW) {
                news[key] = card;
            }
            return news;
        }, {});

        const dictionaries = this.#activeDictionaries.reduce(
            (dictionaries, id) =>([...dictionaries, ...(this.#dictionaries[id] ? [this.#dictionaries[id]] : [])]),
            []
        );

        const words = dictionaries.reduce((words, dictionary) => {
            Object
                .values(getNew(dictionary))
                .forEach(word => {words.push([dictionary.id, word])})
            ;
            return words;
        }, []);

        this.#count = words.length;

        if (this.#set.length > 0) {
            const [dictionaryId, {original}] = this.#set || [];
            if (this.#activeDictionaries.includes(dictionaryId)) {
                const words = getNew(this.#dictionaries[dictionaryId]);
                if (original in words) {
                    this.#set[1] = words[original];
                    return this.#set;
                }
            }
        }

        this.#set = words[Math.floor(Math.random() * words.length)] || [];

        return this.#set;
    }

    skip() {
        this.#set = [];
        this.#setState();
    }
}