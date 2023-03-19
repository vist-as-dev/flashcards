function removeEmptyRows() {
    return new PreprocessingOption(
        'remove_empty_rows',
        'preprocessing.options.isRemoveEmptyRows',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                if (rows[i].trim().length > 0) {
                    result.push(rows[i]);
                }
            }

            return result.join('\n');
        }
    );
}