export class HideToggler {
    toggle(hideElements, showElements) {
        hideElements.forEach(el => el.classList.add('hide'));
        showElements.forEach(el => el.classList.remove('hide'));
    }
}