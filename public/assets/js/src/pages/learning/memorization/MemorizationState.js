import {State} from "../../../storage";
import {Flashcard} from "../../../model";

export class MemorizationState extends State {
    #direction = {};
    #dictionaries = {};
    #set = [];
    #count = 0;

    constructor({storage: {direction, dictionary}}) {
        super({
            word: [],
            choice: [],
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
            word: this.#word,
            choice: this.#choice,
            count: this.#count,
        });
    }

    get #word() {
        const getRepeating = dictionary => Object.entries(dictionary?.flashcards || {}).reduce((news, [key, card]) => {
            if (card.status === Flashcard.STATUS_IN_PROGRESS && card.nextReview < Date.now()) {
                news[key] = card;
            }
            return news;
        }, {});

        const words = Object.values(this.#dictionaries).reduce((words, dictionary) => {
            Object
                .values(getRepeating(dictionary))
                .forEach(word => {words.push([dictionary.id, word])})
            ;
            return words;
        }, []);

        this.#count = words.length;

        if (this.#set.length > 0) {
            const [dictionaryId, {original}] = this.#set || [];
            const words = getRepeating(this.#dictionaries[dictionaryId]);
            if (original in words) {
                this.#set[1] = words[original];
                return this.#set;
            }
        }

        this.#set = words[Math.floor(Math.random() * words.length)] || [];

        return this.#set;
    }

    get #choice() {
        let [, word] = this.#set;
        if (!word?.original) {
            return null;
        }

        word = word?.original;

        function shuffle(array) {
            let currentIndex = array.length,  randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }

            return array;
        }

        const words = shuffle(Object.values(this.#dictionaries).reduce((words, dictionary) => {
            const _words = Object.entries(dictionary?.flashcards || {}).reduce((news, [key, card]) => {
                if (card.status !== Flashcard.STATUS_WELL_KNOWN) {
                    news[key] = card;
                }
                return news;
            }, {});

            Object.keys(_words).forEach(_word => (_word !== word) && words.push(_word));
            return words;
        }, []));

        let result = [word];
        let diff = 0;

        if (words.length < 3) {
            result = [...result, ...words];
        } else {
            while (result.length < 4 && diff < 10) {
                for (const _word of words) {
                    if (Math.abs(_word.length - word.length) < diff && !result.includes(_word)) {
                        result.push(_word);
                        if (result.length === 6) {
                            break;
                        }
                    }
                }
                diff++;
            }
        }

        return shuffle(result);
    }

    skip() {
        this.#set = [];
        this.#setState();
    }
}