const cookie = require('cookie');
const { sortType } = require('./server-constants');

const getRequestCookies = request => cookie.parse(request.headers.cookie || '');

const sortFilms = (sort, films) => {
  switch (sort) {
    case sortType.sortByEpReleaseDateASC:
      return films.sort((a, b) => (a.release_date < b.release_date ? -1 : 1));

    case sortType.sortByEpReleaseDateDESC:
      return films.sort((a, b) => (a.release_date < b.release_date ? 1 : -1));

    case sortType.sortedByEpNumASC:
      return films.sort((a, b) => (a.episode_id < b.episode_id ? -1 : 1));

    case sortType.sortedByEpNumDESC:
      return films.sort((a, b) => (a.episode_id < b.episode_id ? 1 : -1));

    default:
      return films;
  }
};

module.exports = { getRequestCookies, sortFilms };
