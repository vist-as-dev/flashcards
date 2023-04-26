export const dictionaries = {
    schema: {
        title: 'dictionary_db_schema',
        version: 0,
        primaryKey: {
            key: 'id',
            fields: ['source', 'target', 'name'],
            separator: '-',
        },
        type: 'object',
        properties: {
            id: {type: 'string', maxLength: 100},
            gDriveFileId: {type: 'string'},
            name: {type: 'string'},
            source: {type: 'string'},
            target: {type: 'string'},
            flashcards: {
                type: 'array',
                uniqueItems: true,
                items: {
                    type: 'object',
                    items: {
                        type: "object",
                        properties: {
                            original: {type: "string"},
                            glossary: {
                                type: "object",
                                properties: {
                                    definitions: {type: "object"},
                                    examples: {type: "array", items: {type: 'string'}},
                                    original: {type: "string"},
                                    translations: {type: "string"},
                                    transliteration: {type: "string"},
                                }
                            },
                            image: {type: "string"},
                            status: {type: "number"},
                            repetitions: {type: "number"},
                            interval: {type: "number"},
                            easeFactor: {type: "number"},
                            nextReview: {type: "number"},
                        }
                    }
                }
            }
        },
        required: ['name', 'source', 'target'],
    }
}