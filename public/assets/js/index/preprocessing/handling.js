function PreprocessingOptions() {
    this.options = [
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

    this.handle = () => {
        let content = sourceText;

        for (const option of this.options) {
            content = option.handle(content);
        }

        document.getElementById('source_text').value = content;
        document.getElementById('text_volume').innerHTML = content.length.toString() + ' characters / ' + splitToRows(content).length.toString() + ' rows';
    }

    this.turnAll = (value) => this.options.forEach((option) => option.set(value).save());
}

const preprocessingOptions = new PreprocessingOptions();
