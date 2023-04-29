export const synchroDictionary = {
    schema: {
        title: 'synchro_dictionary_db_schema',
        version: 0,
        primaryKey: 'dictionaryId',
        type: 'object',
        properties: {
            dictionaryId: {type: 'string', maxLength: 100},
            gDriveFileId: {type: 'string', default: null},
            isDeleted: {type: 'number', default: 0},
            addedList: {
                type: 'array',
                uniqueItems: true,
                items: {type: 'string'},
                default: [],
            },
            deletedList: {
                type: 'array',
                uniqueItems: true,
                items: {type: 'string'},
                default: [],
            },
            lastSynchroTimestamp: {type: 'number'},
        }
    }
}