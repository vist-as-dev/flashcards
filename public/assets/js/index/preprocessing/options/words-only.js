function wordsOnly() {
    return new PreprocessingOption(
        'words_only',
        'preprocessing.options.isWordsOnly',
        (content) => {
            const regex = XRegExp('\\P{Letter}', 'g');
            return XRegExp.replace(content, regex, ' ').replaceAll(/\s\s+/g, ' ').trim();
        }
    );
}