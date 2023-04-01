import {clearAsSubtitles} from "./clear-as-subtitles.js";
import {clearTags} from "./clear-tags.js";
import {wordsOnly} from "./words-only.js";
import {clearPunctuation} from "./clear-punctuation.js";
import {toLowercase} from "./to-lowercase.js";
import {splitToWords} from "./split-to-words.js";
import {removeEmptyRows} from "./remove-empty-rows.js";
import {removeDuplicates} from "./remove-duplicates.js";
import {remove1Rows} from "./remove-1-rows.js";
import {remove2Rows} from "./remove-2-rows.js";
import {remove3Rows} from "./remove-3-rows.js";

export const options = [
    clearAsSubtitles(),
    clearTags(),
    wordsOnly(),
    clearPunctuation(),
    toLowercase(),
    splitToWords(),
    removeEmptyRows(),
    removeDuplicates(),
    remove1Rows(),
    remove2Rows(),
    remove3Rows(),
];

export {splitToRows} from './option.js';
