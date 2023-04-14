export class State {
    #subscribers = [];
    #state;

    #storageKey;

    constructor(defaultState = {}, storageKey = null) {
        this.#storageKey = storageKey;
        this.#state = null !== this.#storageKey
            ? JSON.parse(localStorage.getItem(this.#storageKey) || JSON.stringify(defaultState))
            : defaultState
        ;
    }

    subscribe(callback) {
        this.#subscribers.push(callback);
        this.#notify();
        return () => this.#subscribers = this.#subscribers.filter(subscriber => subscriber !== callback);
    }

    setState(data) {
        this.#state = {...this.#state, ...data};
        if (null !== this.#storageKey) {
            localStorage.setItem(this.#storageKey, JSON.stringify(this.#state));
        }
        this.#notify();
    }

    getState() {
        return this.#state;
    }

    #notify() {
        return new Promise(() => {
            this.#subscribers.forEach(subscriber => subscriber(this.#state));
        })
    }
}