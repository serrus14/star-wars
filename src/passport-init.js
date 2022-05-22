const passport = require('passport');
const session = require('express-session');
const { sessionIdSecret } = require('./server-constants');
const { UserService } = require('./services/UserService');

module.exports = app => {
  app.use(
    session({
      secret: sessionIdSecret,
      resave: true,
      saveUninitialized: true,
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getUserById(id);
    done(!user, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
