function resize() {
    const container = document.querySelector('main.container');
    const row = document.querySelector('main.container > .row');

    if ((window.innerHeight - 128) > row.offsetHeight) {
        container.classList.add('onscreen');
    } else {
        container.classList.remove('onscreen');
    }
}

window.addEventListener('resize', resize, true);
document.addEventListener('DOMContentLoaded', resize);
