function FB2(content) {
    let regex = XRegExp('<binary[^>]*>[^<]*<\\/binary>', 'gm');
    this.content = XRegExp.replace(content, regex, '');

    const matched = this.content.matchAll(/<section[^>]*?>[^<]*(<title>(?<title>[\s\S]*?)<\/title>)?[^<]*(<subtitle>(?<subtitle>[\s\S]*?)<\/subtitle>)?(?<text>[\s\S]*?)<\/section>/gm);
    this.sections = [...matched].reduce((acc, {groups}) => {
        const title = groups.title && groups.title.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');
        const subtitle = groups.subtitle && groups.subtitle.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');
        const text = groups.text && groups.text.replaceAll(/<[^>]*>/gm, '').replaceAll(/\s{2,}/gm, ' ');

        return [...acc, {title: title && title.trim() + (subtitle ? '. ' + subtitle.trim() : ''), text: text && text.trim()}];
    }, [{title: 'All contents of the book', text: this.content}]);


    this.initSelectChapterField = (field, onChange) => {
        field.innerHTML = '';

        this.sections.forEach(({title}, i) => {
            field.options.add(new Option(title, i, i === 0, i === 0));
        });
        M.FormSelect.init(field);

        field.addEventListener("change", () => onChange(this.sections[field.value].text));
    }
}
