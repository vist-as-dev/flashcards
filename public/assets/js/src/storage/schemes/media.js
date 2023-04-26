export const media = {
    schema: {
        title: 'media_db_schema',
        version: 0,
        primaryKey: 'url',
        type: 'object',
        properties: {
            url: {type: 'string', maxLength: 200},
            content: {type: 'string'},
        },
        required: ['url', 'blob'],
    }
}
