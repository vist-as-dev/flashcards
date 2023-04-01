import {PreprocessingOption} from "./option.js";

export function splitToWords() {
    return new PreprocessingOption(
        'split_to_words',
        'preprocessing.options.isSplitToWords',
        (content) => content.replaceAll(/\s\s+/g, ' ').trim().replaceAll(/\s/g, '\n'),
    );
}