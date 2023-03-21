document.addEventListener('DOMContentLoaded', function() {
    const direction = new Direction(
        'div#download select#source',
        'download.source',
        'div#download select#target',
        'download.target',
    );

    direction.init();
});