const { getConnection } = require('typeorm');
const User = require('../entity/User');
const bcrypt = require('bcrypt');

const addUser = async user => {
  const userRepo = getConnection().getRepository(User);
  const newUser = userRepo.manager.create(User, user);
  password = bcrypt.hashSync(user.password, 12);
  await userRepo.save({ ...newUser, password });
};

const getUserById = async id => {
  const userRepo = getConnection().getRepository(User);
  return await userRepo.findOneBy({ id });
};

const getUserByLogin = async login => {
  const userRepo = getConnection().getRepository(User);
  return await userRepo.findOneBy({ login });
};

const updateUserFavoriteIdList = async (id, favoriteIds) => {
  const userRepo = getConnection().getRepository(User);
  userRepo.update({ id }, { favoriteIds });
};

const isPasswordCorrect = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

const UserService = {
  addUser,
  getUserById,
  getUserByLogin,
  isPasswordCorrect,
  updateUserFavoriteIdList,
};

module.exports = { UserService };
