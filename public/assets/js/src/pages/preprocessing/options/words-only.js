import {PreprocessingOption} from "./option.js";

export function wordsOnly() {
    return new PreprocessingOption(
        'words_only',
        'preprocessing.options.isWordsOnly',
        (content) => {
            let regex;

            regex = XRegExp('(\\S)[^\\p{Letter}\\s`\'.,!?-](\\S)', 'g');
            content = XRegExp.replace(content, regex, '$1 $2');

            regex = XRegExp('[^\\p{Letter}\\s`\'.,!?-]', 'g');
            content = XRegExp.replace(content, regex, '');

            content = content.trim();

            return content;
        }
    );
}