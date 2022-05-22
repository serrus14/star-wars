const express = require('express');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const path = require('path');
const logger = require('morgan');
const initPassport = require('./passport-init');
const { createConnection } = require('typeorm');
const { initAppState } = require('./server-state');
const { dbConnectionUrl } = require('./server-constants');
const { getRequestCookies } = require('./server-utils');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

createConnection({
  type: 'postgres',
  url: dbConnectionUrl,
  entities: [require('./entity/User')],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: true,
})
  .then(async () => {
    (async () => {
      const app = express();

      await initAppState();

      app.engine(
        'hbs',
        expressHbs.engine({
          layoutsDir: path.join(__dirname, 'views'),
          defaultLayout: 'layout',
          extname: 'hbs',
        })
      );
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'hbs');
      hbs.registerPartials(__dirname + '/views/partials');

      initPassport(app);

      app.use(express.urlencoded({ extended: true }));
      app.use(logger('dev'));
      app.use(express.static(path.join(__dirname, 'public')));

      app.use(require('./endpoints/endpoints'));
      app.use((request, response, next) => {
        const reqCookies = getRequestCookies(request);
        response.render('notFound', {
          title: 'Not found',
          user: request.session.user,
          isDarkMode: reqCookies.isDarkMode,
        });
      });

      app.listen(process.env.PORT || 3000, () => console.log('started at http://localhost:3000 🚀'));
    })();
  })
  .catch(error => console.log(error));
