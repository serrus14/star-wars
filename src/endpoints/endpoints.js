const express = require('express');
const { route } = require('../server-constants');
const { UserService } = require('../services/UserService');
const {
  getFilmsPage,
  getFavoritesPage,
  getFilmPage,
  getRegisterPage,
  getLoginPage,
  handleRegister,
  handleLogin,
  handleLogout,
  handleUpdateUserFavoriteIdList,
} = require('./endpoint-handlers');
const router = express.Router();

const isAuthenticated = async (request, response, next) => {
  if (request.session.user) {
    request.session.user = await UserService.getUserById(request.session.user.id);
    next();
  } else response.redirect(route.login);
};

router.get(route.films, isAuthenticated, getFilmsPage);
router.get(route.film, isAuthenticated, getFilmPage);
router.post(route.film, isAuthenticated, handleUpdateUserFavoriteIdList);
router.get(route.favorites, isAuthenticated, getFavoritesPage);
router.get(route.register, getRegisterPage);
router.get(route.login, getLoginPage);
router.post(route.register, handleRegister);
router.post(route.login, handleLogin);
router.get(route.logout, handleLogout);

module.exports = router;
