import {PreprocessingOption, splitToRows} from "./option.js";

export function clearAsSubtitles() {
    return new PreprocessingOption(
        'clear_as_subtitles',
        'preprocessing.options.isClearAsSubtitles',
        (content) => {
            const rows = splitToRows(content);

            const result = [];
            for (const i in rows) {
                const regex = XRegExp('\\P{Letter}', 'g');

                result.push(
                    XRegExp.replace(rows[i], regex, '').trim().length > 0
                        ? rows[i]
                        : '\n'
                );
            }

            return result.join('\n')
                .replace(/([^\n])\n([^\n])/g, "$1 $2")
                .replace(/\n{2,}/g, "\n");
        });
}