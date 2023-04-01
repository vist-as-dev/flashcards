export class ListenerWrapper {
    listener(e, callback) {
        e.stopPropagation();
        e.preventDefault();

        callback(e);
    }
}