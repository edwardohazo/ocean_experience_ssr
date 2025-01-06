const burgerMenu = document.getElementById('burgerMenu');
const navMenu = document.getElementById('navMenu');
const closeMenu = document.getElementById('closeMenu');
const html = document.documentElement;  // Target the html element as well
const body = document.body;

burgerMenu.addEventListener('click', () => {
    navMenu.classList.add('active');
    html.style.overflow = 'hidden'; // Disable scrolling on html
    body.style.overflow = 'hidden'; // Disable scrolling on body
});

closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('active');
    html.style.overflow = 'auto'; // Re-enable scrolling on html
    body.style.overflow = 'auto'; // Re-enable scrolling on body
});
