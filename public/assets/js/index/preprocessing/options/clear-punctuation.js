function clearPunctuation() {
    return new PreprocessingOption(
        'clear_punctuation',
        'preprocessing.options.isPunctuation',
        (content) => {
            let regex;

            regex = XRegExp('([^\s])[.,!?-]([^\s])', 'gm');
            content = XRegExp.replace(content, regex, '$1 $2');

            regex = XRegExp('\s[\'’.,!?-]\s', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('\s[\'’.,!?-]', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('[\'’.,!?-](\\s)', 'gm');
            content = XRegExp.replace(content, regex, '$1');

            regex = XRegExp('^[\'’.,!?-]', 'gm');
            content = XRegExp.replace(content, regex, '');

            regex = XRegExp('[\'’.,!?-]$', 'gm');
            content = XRegExp.replace(content, regex, '');

            return content;
        }
    );
}