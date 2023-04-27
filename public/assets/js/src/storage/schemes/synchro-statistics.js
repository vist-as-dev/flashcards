export const synchroStatistics = {
    schema: {
        title: 'synchro_statistics_db_schema',
        version: 0,
        primaryKey: {
            key: 'id',
            fields: ['source', 'target'],
            separator: '-',
        },
        type: 'object',
        properties: {
            id: {type: 'string', maxLength: 100},
            source: {type: 'string'},
            target: {type: 'string'},
            days: {
                type: 'array',
                uniqueItems: true,
                items: {
                    type: 'object',
                    properties: {
                        localeDate: {type: 'string'},
                        started: {type: 'number'},
                        repeated: {type: 'number'},
                        completed: {type: 'number'},
                        wellKnown: {type: 'number'},
                    }
                }
            },
            lastSynchroTimestamp: {type: 'number'},
        }
    }
}