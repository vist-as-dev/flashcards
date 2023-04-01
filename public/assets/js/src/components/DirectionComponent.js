export function DirectionComponent(sourceSelector, sourceKey, targetSelector, targetKey) {
    this.init = (languages) => {
        const source = document.querySelector(sourceSelector);
        const target = document.querySelector(targetSelector);

        source.addEventListener("change", () => localStorage.setItem(sourceKey, source.value));
        target.addEventListener("change", () => localStorage.setItem(targetKey, target.value));

        const sourceSelected = localStorage.getItem(sourceKey);
        const targetSelected = localStorage.getItem(targetKey);

        languages.forEach(([code, name], i) => {
            const _sourceSelected = sourceSelected ? code === sourceSelected : i === 0;
            const _targetSelected = targetSelected ? code === targetSelected : i === 0;

            source.options.add(new Option(name, code, _sourceSelected, _sourceSelected));
            target.options.add(new Option(name, code, _targetSelected, _targetSelected));
        }, () => {
            M.FormSelect.init(source);
            M.FormSelect.init(target);
        });
    }
}