export class ExportDictionaryService {
    static download(dictionary) {
        const blob = new Blob([JSON.stringify(dictionary)], {type: "application/json;charset=utf-8"});
        const url = (window.URL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = encodeURIComponent(dictionary.name) + '.json';

        document.body.append(a);
        a.click();
        a.remove();

        (window.URL) ? window.URL.revokeObjectURL(url) : window.webkitURL.revokeObjectURL(url);

        M.toast({html: 'Done!'})
    }
}