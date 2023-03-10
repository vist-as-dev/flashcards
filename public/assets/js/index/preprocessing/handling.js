const isClearAsSubtitles = document.getElementById('clear_as_subtitles');
const isClearTags = document.getElementById('clear_tags');
const isWordsOnly = document.getElementById('words_only');
const isToLowercase = document.getElementById('to_lowercase');
const isSplitToWords = document.getElementById('split_to_words');
const isRemoveEmptyRows = document.getElementById('remove_empty_rows');
const isRemoveDuplicates = document.getElementById('remove_duplicates');
const isRemove1LetterRows = document.getElementById('remove_1_rows');
const isRemove2LetterRows = document.getElementById('remove_2_rows');
const isRemove3LetterRows = document.getElementById('remove_3_rows');

function splitToRows(content) {
    let rows = content.split('\r\n');

    if (rows.length === 1) {
        rows = content.split('\n');
    }

    if (rows.length === 1) {
        rows = content.split('\r');
    }

    return rows
}

function handle() {
    let content = sourceText;

    if (isClearAsSubtitles.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            const regex = XRegExp('\\P{Letter}', 'g');
            if (XRegExp.replace(rows[i], regex, '').trim().length > 0) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isClearTags.checked) {
        const regex = XRegExp('[<][^>]*[>]', 'gm');
        content = XRegExp.replace(content, regex, '\n');
    }

    if (isRemoveEmptyRows.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            if (rows[i].trim().length > 0) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isWordsOnly.checked) {
        const regex = XRegExp('\\P{Letter}', 'g');
        content = XRegExp.replace(content, regex, ' ').replaceAll(/\s\s+/g, ' ').trim();
    }

    if (isSplitToWords.checked) {
        content = content.replaceAll(/\s\s+/g, ' ').trim().replaceAll(/\s/g, '\n');
    }

    if (isRemoveDuplicates.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            if (!result.includes(rows[i])) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isRemove1LetterRows.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            if (rows[i].length > 1) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isRemove2LetterRows.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            if (rows[i].length > 2) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isRemove3LetterRows.checked) {
        const rows = splitToRows(content);

        const result = [];
        for (const i in rows) {
            if (rows[i].length > 3) {
                result.push(rows[i]);
            }
        }

        content = result.join('\n');
    }

    if (isToLowercase.checked) {
        content = content.toLowerCase();
    }

    document.getElementById('source_text').value = content;
    document.getElementById('text_volume').innerHTML = content.length.toString() + ' characters / ' + splitToRows(content).length.toString() + ' rows';

    localStorage.setItem('preprocessing.options.isClearAsSubtitles', isClearAsSubtitles.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isClearTags', isClearTags.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isRemoveEmptyRows', isRemoveEmptyRows.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isWordsOnly', isWordsOnly.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isSplitToWords', isSplitToWords.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isRemoveDuplicates', isRemoveDuplicates.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isRemove1LetterRows', isRemove1LetterRows.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isRemove2LetterRows', isRemove2LetterRows.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isRemove3LetterRows', isRemove3LetterRows.checked ? 'checked' : 'unchecked');
    localStorage.setItem('preprocessing.options.isToLowercase', isClearAsSubtitles.checked ? 'checked' : 'unchecked');
}

isClearAsSubtitles.checked = localStorage.getItem('preprocessing.options.isClearAsSubtitles') === 'checked';
isClearTags.checked = localStorage.getItem('preprocessing.options.isClearTags') === 'checked';
isRemoveEmptyRows.checked = localStorage.getItem('preprocessing.options.isRemoveEmptyRows') === 'checked';
isWordsOnly.checked = localStorage.getItem('preprocessing.options.isWordsOnly') === 'checked';
isSplitToWords.checked = localStorage.getItem('preprocessing.options.isSplitToWords') === 'checked';
isRemoveDuplicates.checked = localStorage.getItem('preprocessing.options.isRemoveDuplicates') === 'checked';
isRemove1LetterRows.checked = localStorage.getItem('preprocessing.options.isRemove1LetterRows') === 'checked';
isRemove2LetterRows.checked = localStorage.getItem('preprocessing.options.isRemove2LetterRows') === 'checked';
isRemove3LetterRows.checked = localStorage.getItem('preprocessing.options.isRemove3LetterRows') === 'checked';
isToLowercase.checked = localStorage.getItem('preprocessing.options.isToLowercase') === 'checked';

function turnAllProcessingOptions(value) {
    isClearAsSubtitles.checked = !!value;
    isClearTags.checked = !!value;
    isRemoveEmptyRows.checked = !!value;
    isWordsOnly.checked = !!value;
    isSplitToWords.checked = !!value;
    isRemoveDuplicates.checked = !!value;
    isRemove1LetterRows.checked = !!value;
    isRemove2LetterRows.checked = !!value;
    isRemove3LetterRows.checked = !!value;
    isToLowercase.checked = !!value;
}