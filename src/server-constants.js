const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;

const sortType = {
  sortByEpReleaseDateASC: 'sortByEpReleaseDateASC',
  sortByEpReleaseDateDESC: 'sortByEpReleaseDateDESC',
  sortedByEpNumASC: 'sortedByEpNumASC',
  sortedByEpNumDESC: 'sortedByEpNumDESC',
};

const viewMode = {
  cards: 'cards',
  list: 'list',
};

const route = {
  films: '/',
  film: '/film/:id',
  favorites: '/favorites',
  register: '/register',
  login: '/login',
  logout: '/logout',
};

const dbConnectionUrl = process.env.DATABASE_URL;
const sessionIdSecret =
  '4910cd08d6dcac0f884bbe705c97d3d427a0e743ed74f7e012adb35b9888ce757cc2b83955ab9ae8f29620d0778e373c275d94e1d5135072c19b6c3720cf2e48';

module.exports = {
  oneMonthInMilliseconds,
  sortType,
  viewMode,
  route,
  dbConnectionUrl,
  sessionIdSecret,
};
