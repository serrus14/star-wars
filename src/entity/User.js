var EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
      nullable: false,
    },
    login: {
      type: 'varchar',
      length: 32,
      nullable: false,
    },
    password: {
      type: 'varchar',
      length: 60,
      nullable: false,
    },
    avatarUrl: {
      type: 'varchar',
      nullable: true,
    },
    favoriteIds: {
      type: 'json',
      nullable: true,
    },
  },
});
