const setThemeMenuLabel = (theme) => {
    let elem = document.getElementById('theme-holder-menu');
    if (elem) {
        if (theme == 'light') {
            elem.dataset.theme = 'dark';
            elem.textContent = 'Dark Theme';
        } else {
            elem.dataset.theme = 'light';
            elem.textContent = 'Light Theme';
        }
    }
}

const setTheme = (el, theme) => {
    theme = theme || el.dataset.theme;
    const html = document.querySelector('html');
    html.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
    setThemeMenuLabel(theme);
}

if (localStorage.getItem('theme')) {
    setTheme(null, localStorage.getItem('theme'));
} else {
    setTheme(null, 'light');
}