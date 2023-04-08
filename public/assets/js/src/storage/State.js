export class State {
    #subscribers = [];
    #state = {};

    constructor(defaultState) {
        this.#state = defaultState;
    }

    subscribe(callback) {
        this.#subscribers.push(callback);
        return () => this.#subscribers = this.#subscribers.filter(subscriber => subscriber !== callback);
    }

    setState(data) {
        this.#state = {...this.#state, ...data};
        this.#subscribers.forEach(subscriber => subscriber(this.#state));
    }
}