export const synchroDictionary = {
    schema: {
        title: 'synchro_dictionary_db_schema',
        version: 0,
        primaryKey: {
            key: 'dictionaryId',
        },
        type: 'object',
        properties: {
            dictionaryId: {type: 'string', maxLength: 100},
            added: {
                type: 'array',
                uniqueItems: true,
                items: {type: 'string'}
            },
            deleted: {
                type: 'array',
                uniqueItems: true,
                items: {type: 'string'}
            },
            lastSynchroTimestamp: {type: 'number'},
        }
    }
}