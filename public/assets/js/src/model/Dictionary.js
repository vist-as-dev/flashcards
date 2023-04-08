export class Dictionary {
    constructor({id, name, source, target, count = 0, words = {}}) {
        this.id = id;
        this.name = name;
        this.source = source;
        this.target = target;
        this.count = count;
        this.words = words;
        this.type = 'dictionary';
        this.unsubscribe = null;
    }
}
