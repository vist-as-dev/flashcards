document.addEventListener('DOMContentLoaded', function() {
    const direction = new Direction(
        'div#dictionaries select#source',
        'dictionaries.source',
        'div#dictionaries select#target',
        'dictionaries.target',
    );

    direction.init();
});