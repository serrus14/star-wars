const filmsBtn = document.querySelector('#filmsBtn');
const favoritesBtn = document.querySelector('#favoritesBtn');
const loginBtn = document.querySelector('#loginBtn');
const registerBtn = document.querySelector('#registerBtn');
const sortBySelect = document.querySelector('#sortBySelect');
const viewModeListBtn = document.querySelector('#viewModeListBtn');
const viewModeCardsBtn = document.querySelector('#viewModeCardsBtn');
const lightModeBtn = document.querySelector('#lightModeBtn');
const darkModeBtn = document.querySelector('#darkModeBtn');
const logoutBtn = document.querySelector('#logoutBtn');

const setCurrentRoute = route => (document.location.href = document.location.origin + route);

const defaultEventHandler = (domEl, eventType, handler, reload = true) =>
  domEl.addEventListener(eventType, event => {
    handler(event);
    reload && document.location.reload();
  });

const handleButtonClick = (btn, handler, enableReload) => defaultEventHandler(btn, 'click', handler, enableReload);
const handleSelectChange = (select, handler, enableReload) =>
  defaultEventHandler(select, 'change', handler, enableReload);

handleButtonClick(lightModeBtn, () => setCookie('isDarkMode', ''));
handleButtonClick(darkModeBtn, () => setCookie('isDarkMode', 'true'));

filmsBtn && handleButtonClick(filmsBtn, () => setCurrentRoute(clientConsts.route.films), false);
favoritesBtn && handleButtonClick(favoritesBtn, () => setCurrentRoute(clientConsts.route.favorites), false);
loginBtn && handleButtonClick(loginBtn, () => setCurrentRoute(clientConsts.route.login), false);
registerBtn && handleButtonClick(registerBtn, () => setCurrentRoute(clientConsts.route.register), false);
logoutBtn && handleButtonClick(logoutBtn, () => setCurrentRoute(clientConsts.route.logout), false);

viewModeListBtn && handleButtonClick(viewModeListBtn, () => setCookie('viewMode', 'list'));
viewModeCardsBtn && handleButtonClick(viewModeCardsBtn, () => setCookie('viewMode', 'cards'));
sortBySelect && handleSelectChange(sortBySelect, e => setCookie('sort', e.target.value));
