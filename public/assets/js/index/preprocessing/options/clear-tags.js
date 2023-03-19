function clearTags() {
    return new PreprocessingOption(
        'clear_tags',
        'preprocessing.options.isClearTags',
        (content) => {
            const regex = XRegExp('[<][^>]*[>]', 'gm');
            return XRegExp.replace(content, regex, '\n');
        }
    );
}