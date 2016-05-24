'use strict';

require('dotenv').config(); // loads env vars (don't need in prod)

// built-in requires
const path = require('path');

// main base tech stack requires
const express = require('express');
const app = express();

// other base tech stack requires
const favicon = require('serve-favicon');


// authentication and its dependency requires
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


// development requires
const morgan = require('morgan');


// custom requires
const port = process.env.PORT || 5000;
const routes = require('./app/server/routes');
const config = require('./app/server/config');

require('./app/server/controllers/middlewares/passport')(passport); // pass passport for configuration.

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/app/server/views'));
app.locals.basedir = app.get('views'); // allows for pug includes


//app.listen(5000, () => { console.log("Running on 5000."); });
app.set('port', port);
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(favicon(path.join(__dirname, '/static/img/favicon.ico')));

app.use(morgan('dev')); // log every request to console.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


routes(app, passport); // apparently it doesn't matter if this is before or after the port is set...

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});


