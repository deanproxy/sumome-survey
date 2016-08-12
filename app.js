var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Password = require('./helpers/password');
var models = require('./models');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var db = require('./config/config.json');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var options = db[app.get('env')];
options.user = options.username;
options.createDatabaseTable = false;
var sessionStore = new MySQLStore(options);


app.use(session({
  key: 'survey-cookie-session',
  secret: 'survey-cookie-session',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/* Setup local strategy for logging in. */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  models.User.find({where: {id:id}}).then(function(user) {
    done(null, user);
  }).error(function(err) {
    done(err, null);
  });
});
passport.use(new LocalStrategy(function(username, password, done) {
  models.User.findOne({where: {username: username}}).then(function(user) {
    if (!user) {
      console.log("Incorrect username.");
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }

    if (!Password.confirm(password, user.password)) {
      console.log("Incorrect password.");
      return done(null, false, {
        message: 'Incorrect password.'
      });
    }
    return done(null, user);
  }).catch(function(err) {
    console.log(err);
    return done(null, false, {
      message: err 
    });
  });
}));



module.exports = app;
