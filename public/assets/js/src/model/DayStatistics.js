export class DayStatistics {
    constructor({started = 0, repeated = 0, completed = 0, wellKnown = 0} = {}) {
        this.started = started;
        this.repeated = repeated;
        this.completed = completed;
        this.wellKnown = wellKnown;
    }
}