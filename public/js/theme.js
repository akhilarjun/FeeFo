const setTheme = (el, theme) => {
    theme = theme || el.dataset.theme;
    const html = document.querySelector('html');
    html.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
}

if (localStorage.getItem('theme')) {
    setTheme(null, localStorage.getItem('theme'));
} else {
    setTheme(null, 'light');
}