function toLowercase() {
    return new PreprocessingOption(
        'to_lowercase',
        'preprocessing.options.isToLowercase',
        (content) => content.toLowerCase()
    );
}