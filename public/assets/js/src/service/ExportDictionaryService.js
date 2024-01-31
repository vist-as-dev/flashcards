export class ExportDictionaryService {
    static download(dictionary) {
        const total = Object.keys(dictionary.flashcards).length

        const bungle = 1000;
        let list = total < bungle ? {[dictionary.name]: dictionary} : Object.keys(dictionary.flashcards).reduce(
            (acc, origin, i) => {
                const name = `${dictionary.name}-${Math.trunc(i/bungle) + 1}`
                if (!(name in acc)) {
                    acc[name] = {...dictionary, name, flashcards: {}, gDriveFileId: undefined}
                }
                acc[name].flashcards[origin] = {...dictionary.flashcards[origin]}
                return acc
            }, {}
        )

        for (const name in list) {
            const blob = new Blob([JSON.stringify(list[name])], {type: "application/json;charset=utf-8"});
            const url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = encodeURIComponent(name) + '.json';

            document.body.append(a);
            a.click();
            a.remove();

            (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);
        }

        M.toast({html: 'Done!'})
    }
}