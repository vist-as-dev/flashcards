export class Dictionary {
    constructor({id, gDriveFileId, name, source, target, flashcards = {}}) {
        this.id = id;
        this.gDriveFileId = gDriveFileId;
        this.name = name;
        this.source = source;
        this.target = target;
        this.flashcards = flashcards;
    }
}
