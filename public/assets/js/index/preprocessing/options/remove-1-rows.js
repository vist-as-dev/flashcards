function remove1Rows() {
    return new PreprocessingOption(
        'remove_1_rows',
        'preprocessing.options.isRemove1LetterRows',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                if (rows[i].length > 1) {
                    result.push(rows[i]);
                }
            }

            return result.join('\n');
        }
    );
}