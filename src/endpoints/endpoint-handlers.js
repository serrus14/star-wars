const { viewMode, sortType, route, oneMonthInMilliseconds } = require('../server-constants');
const { getFilms } = require('../server-state');
const { getRequestCookies, sortFilms } = require('../server-utils');
const { UserService } = require('../services/UserService');

const setDefaultPageProps = (title, user, request) => {
  const reqCookies = getRequestCookies(request);
  return { title, user, isDarkMode: reqCookies.isDarkMode, ['isCurrentPage' + title]: true };
};

const setFilmsTemplateProps = (request, isCurrentPageFilms) => {
  const reqCookies = getRequestCookies(request);
  return {
    film: isCurrentPageFilms
      ? sortFilms(reqCookies.sort, getFilms())
      : sortFilms(
          reqCookies.sort,
          getFilms().filter(f => (request.session.user.favoriteIds || []).includes(f.episode_id))
        ),
    viewMode: {
      isViewModeEqualsCards: reqCookies.viewMode ? reqCookies.viewMode === viewMode.cards : true,
      isViewModeEqualsList: reqCookies.viewMode ? reqCookies.viewMode === viewMode.list : false,
    },
    sort: {
      isSortedByReleaseDateASC: reqCookies.sort === sortType.sortByEpReleaseDateASC,
      isSortedByReleaseDateDESC: reqCookies.sort === sortType.sortByEpReleaseDateDESC,
      isSortedByEpNumASC: reqCookies.sort === sortType.sortedByEpNumASC,
      isSortedByEpNumDESC: reqCookies.sort === sortType.sortedByEpNumDESC,
    },
  };
};

const getFilmsPage = (request, response) =>
  response.render('films', {
    ...setDefaultPageProps('Films', request.session.user, request),
    ...setFilmsTemplateProps(request, true),
  });

const getFilmPage = (request, response) => {
  const filmId = request.params.id;
  const film = getFilms().filter(f => f.episode_id === +filmId)[0];
  response.render('film', {
    ...setDefaultPageProps(film.title, request.session.user, request),
    film: { ...film, isFavorited: (request.session.user.favoriteIds || []).includes(+film.episode_id) },
  });
};

const getFavoritesPage = (request, response) =>
  response.render('films', {
    ...setDefaultPageProps('Favorites', request.session.user, request),
    ...setFilmsTemplateProps(request, false),
  });

const getRegisterPage = (request, response) => {
  if (request.session.user) return response.redirect(route.films);
  response.render('auth', {
    ...setDefaultPageProps('Register', null, request),
    submitButtonTitle: 'Create an account',
  });
};

const getLoginPage = (request, response) => {
  if (request.session.user) return response.redirect(route.films);
  response.render('auth', {
    ...setDefaultPageProps('Login', null, request),
    submitButtonTitle: 'Login',
  });
};

const handleRegister = async (request, response) => {
  let login = request.body.login;
  let password = request.body.password;
  let avatarUrl = request.body.avatarUrl || null;
  let isSuccessful = false;
  let registerFailedMessage = !login || !password ? 'Incorrect data' : '';
  if (!registerFailedMessage) {
    const user = await UserService.getUserByLogin(login);
    user && (registerFailedMessage = 'User with this login already exists');
    !user && UserService.addUser({ login, password, avatarUrl });
    !user && (isSuccessful = true);
  }
  response.render('auth', {
    ...setDefaultPageProps('Register', null, request),
    submitButtonTitle: 'Create an account',
    registeredSuccessfully: isSuccessful,
    registerFailedMessage,
  });
};

const handleLogin = async (request, response) => {
  let login = request.body.login;
  let password = request.body.password;
  let isSuccessful = false;
  let isFailed = !login || !password;
  let user = !isFailed && (await UserService.getUserByLogin(login));
  if (!user) isFailed = true;
  if (user) UserService.isPasswordCorrect(password, user.password) && (isSuccessful = true);
  if (isSuccessful) {
    request.session.user = user;
    request.session.cookie.maxAge = oneMonthInMilliseconds;
    return response.redirect(route.films);
  }
  response.render('auth', {
    ...setDefaultPageProps('Login', null, request),
    submitButtonTitle: 'Login',
    loginFailed: true,
  });
};

const handleLogout = async (request, response) =>
  request.session.destroy(() => {
    response.redirect(route.films);
  });

const handleUpdateUserFavoriteIdList = async (request, response) => {
  const filmId = +request.body.filmId;
  const isActionEqualDelete = request.body.hasOwnProperty('removeFromFavorite');
  if (!filmId) response.redirect(route.films);
  const favoriteIdList = isActionEqualDelete
    ? request.session.user.favoriteIds.filter(fId => fId !== filmId)
    : request.session.user.favoriteIds
    ? [...request.session.user.favoriteIds, filmId]
    : [filmId];
  await UserService.updateUserFavoriteIdList(request.session.user.id, favoriteIdList);
  request.session.user = { ...request.session.user, favoriteId: favoriteIdList };
  response.redirect(request.headers.referer);
};

module.exports = {
  getFilmsPage,
  getFilmPage,
  getFavoritesPage,
  getRegisterPage,
  getLoginPage,
  handleRegister,
  handleLogin,
  handleLogout,
  handleUpdateUserFavoriteIdList,
};
