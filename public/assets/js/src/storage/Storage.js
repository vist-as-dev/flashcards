export class Storage {
    #subscribers = [];

    subscribe(callback) {
        this.#subscribers.push(callback);
        return () => this.#subscribers = this.#subscribers.filter(subscriber => subscriber !== callback);
    }

    notify(data) {
        this.#subscribers.forEach(subscriber => subscriber(data));
    }
}