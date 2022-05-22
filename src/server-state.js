const axios = require('axios');

let films;

const initAppState = async () => await getDataFromApi();

const getDataFromApi = async () => {
  const response = await axios.get(`https://swapi.dev/api/films`);
  films = response.data.results;
};

const getFilms = () => [...films];

module.exports = {
  initAppState,
  getFilms,
};
