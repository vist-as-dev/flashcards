import {PreprocessingOption, splitToRows} from "./option.js";

export function remove2Rows() {
    return new PreprocessingOption(
        'remove_2_rows',
        'preprocessing.options.isRemove2LetterRows',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                if (rows[i].length !== 2) {
                    result.push(rows[i]);
                }
            }

            return result.join('\n');
        }
    );
}