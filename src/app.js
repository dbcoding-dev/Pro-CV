const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require('body-parser');
const db = require("./models/index.js");
const adminMenu = require("./routes/router.js");
const pdfGent = require("./routes/pdfrouter.js");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const MySQLStore = require('express-mysql-session')(session);
const config = require('./config/config.json');
const dotenv = require('dotenv');
dotenv.config();
const GlobalDataMiddleware = require("./middleware/varMiddleware.js");
const methodOverride = require('method-override');
const { IpDeniedError } = require('./middleware/ipfilter.js');
const { authenticateUser, sessionId } = require('./middleware/authenticate.js');
const csrfUtil = require('./utils/csrf.js');

const PORT = process.env.PORT || 3005;

const dbOptions = {
  host: config.development.host,
  port: config.development.port,
  user: config.development.username,
  password: config.development.password,
  database: config.development.database,
};

const sessionStore = new MySQLStore(dbOptions);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'dashboard',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    rolling: true,
  },
}));

app.use(flash());
app.use(methodOverride('_method'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(
  GlobalDataMiddleware.setBlogFooterList,
  GlobalDataMiddleware.setSiteList,
  GlobalDataMiddleware.setCommentList,
  GlobalDataMiddleware.setCirriculumList,
  GlobalDataMiddleware.setUser,
);
app.use(authenticateUser);
app.use(sessionId);

// Kullanıcı bilgilerini tüm şablonlara erişilebilir hale getirin
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});



app.use("/", adminMenu);
app.use('/', pdfGent);


app.use((err, req, res, next) => {
  if (err instanceof IpDeniedError) {
    return res.status(200).render('login', {
      error: err.message
    });
  }
  console.error(err); // Hatanın detaylarını loglayın
  res.status(500).render('error/404', { error: 'Sunucu hatası.' });
});

app.use((req, res) => {
  res.status(404).render('error/404');
});

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
