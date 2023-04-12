import {State} from "../../../storage";
import {Word} from "../../../model";

export class MemorizationState extends State{
    #direction = {};
    #dictionaries = {};
    #set = [];
    #count = 0;

    constructor({storage: {direction, dictionary}}) {
        super({});

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
        const getRepeating = dictionary => dictionary?.words?.filter(
            ({step, nextReview}) => step === Word.STATUS_IN_PROGRESS && nextReview < Date.now()
        ) || {};

        if (this.#set.length > 0) {
            const [dictionaryId, {word}] = this.#set || [];
            const words = getRepeating(this.#dictionaries[dictionaryId]);
            if (word in words) {
                this.#set[1] = words[word];
                return this.#set;
            }
        }

        const words = Object.values(this.#dictionaries).reduce((words, dictionary) => {
            Object
                .values(getRepeating(dictionary))
                .forEach(word => {words.push([dictionary.id, word])})
            ;
            return words;
        }, []);

        this.#set = words[Math.floor(Math.random() * words.length)] || [];
        this.#count = words.length;

        return this.#set;
    }

    get #choice() {
        let [, word] = this.#set;
        if (!word?.word) {
            return null;
        }

        word = word?.word;

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
            const _words = dictionary?.words?.filter(({step}) => step !== Word.STATUS_WELL_KNOWN);
            Object.keys(_words).forEach(_word => words.push(_word));
            return words;
        }, []));

        let result = [word];
        let diff = 0;

        if (words.length < 3) {
            result = [...result, ...words];
        } else {
            while (result.length < 4) {
                for (const _word of words) {
                    if (Math.abs(_word.length - word.length) < diff && !result.includes(_word)) {
                        result.push(_word);
                        if (result.length === 4) {
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