function Dictionary() {
    const addElement = document.querySelector('div#dictionaries .collection-item.new');
    const formElement = document.querySelector('div#dictionaries .collection-item#new-dictionary-form');
    const nameElement = formElement.querySelector('#dictionary-name');
    const sourceElement = formElement.querySelector('#source');
    const targetElement = formElement.querySelector('#target');

    this.onAddClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        addElement.classList.add('hide');
        formElement.classList.remove('hide');
        nameElement.focus();
    }

    this.onSaveClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        createDictionary(nameElement.value, sourceElement.value, targetElement.value).then(console.log);

        formElement.classList.add('hide');
        addElement.classList.remove('hide');
    }

    this.onCancelClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        getDictionaryList().then(
            dictionaries => {
                console.log(dictionaries)
                updateDictionary("1NXN1PkaepYG5lPr4R_MKriy6UriRTfM5bellzO5xYcXPl8f_Sw", {1: {status: 3}}).then(
                    (res) => {
                        console.log({update: res})
                        getDictionary("1NXN1PkaepYG5lPr4R_MKriy6UriRTfM5bellzO5xYcXPl8f_Sw").then((res) => console.log(res))
                    }
                )
            }
        );

        formElement.classList.add('hide');
        addElement.classList.remove('hide');
    }

    this.onClick = (e) => {
        e.preventDefault();
        console.log(e.target.dataset.id);
    }

    this.onRemoveClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const itemElement = e.target.closest('[data-id]');
        const listElement = itemElement.closest('.collection');
        [...listElement.querySelectorAll('.right.remove')].forEach(el => el.classList.remove('hide'));
        [...listElement.querySelectorAll('.right.confirm')].forEach(el => el.classList.add('hide'));
        [...listElement.querySelectorAll('.right.cancel')].forEach(el => el.classList.add('hide'));

        e.target.classList.add('hide');
        itemElement.querySelector('.right.confirm').classList.remove('hide');
        itemElement.querySelector('.right.cancel').classList.remove('hide');

        console.log('remove: ' + itemElement.dataset.id);
    }
}

const dictionary = new Dictionary();

document.addEventListener('DOMContentLoaded', () => {
    [
        ...document.querySelectorAll('div#dictionaries .collection-item[data-id]')
    ].forEach((element) => element.addEventListener('click', dictionary.onClick));

    [
        ...document.querySelectorAll('div#dictionaries .collection-item[data-id] .right')
    ].forEach((element) => element.addEventListener('click', dictionary.onRemoveClick));

    document
        .querySelector('div#dictionaries .collection-item.new')
        .addEventListener('click', dictionary.onAddClick);
    document
        .querySelector('div#dictionaries .collection-item#new-dictionary-form #save-btn')
        .addEventListener('click', dictionary.onSaveClick);
    document
        .querySelector('div#dictionaries .collection-item#new-dictionary-form #cancel-btn')
        .addEventListener('click', dictionary.onCancelClick);
});