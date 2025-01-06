const $goto = document.querySelector('.logo-img');

// remove this class and add above to html pages
// const $goto = document.querySelector('.body__header-nav--one-div--one-img--one');



$goto.addEventListener('click', () => {
    if (location.href !== 'http://127.0.0.1:5500/frontend/index.html') {
        location.href = '../index.html';
    } else {
        location.href = './index.html';
        console.log(2);
    }
});