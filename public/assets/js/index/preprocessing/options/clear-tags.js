function clearTags() {
    return new PreprocessingOption(
        'clear_tags',
        'preprocessing.options.isClearTags',
        (content) => {
            let regex;

            regex = XRegExp('\s[<][^>]*[>]\s', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('\s[<][^>]*[>]', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('[<][^>]*[>]\s', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('^[<][^>]*[>]', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('[<][^>]*[>]$', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('([^\s])[<][^>]*[>]([^\s])', 'gm');
            content = XRegExp.replace(content, regex, '$1 $2');

            return content;
        }
    );
}