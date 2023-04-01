import {PreprocessingOption, splitToRows} from "./option.js";

export function remove3Rows() {
    return new PreprocessingOption(
        'remove_3_rows',
        'preprocessing.options.isRemove3LetterRows',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                if (rows[i].length !== 3) {
                    result.push(rows[i]);
                }
            }

            return result.join('\n');
        }
    );
}