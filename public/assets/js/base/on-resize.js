function resize() {
    const container = document.querySelector('.container');
    const row = document.querySelector('.container > .row');

    if (window.innerHeight > row.offsetHeight) {
        container.classList.add('onscreen');
    } else {
        container.classList.remove('onscreen');
    }
}

window.addEventListener('resize', resize, true);
document.addEventListener('DOMContentLoaded', resize);

