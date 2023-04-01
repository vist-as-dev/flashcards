import {PreprocessingOption, splitToRows} from "./option.js";

export function removeDuplicates() {
    return new PreprocessingOption(
        'remove_duplicates',
        'preprocessing.options.isRemoveDuplicates',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                if (!result.includes(rows[i])) {
                    result.push(rows[i]);
                }
            }

            return result.join('\n');
        }
    );
}