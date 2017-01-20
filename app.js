'use strict';

// can't use import natively yet as V8 doesn't have support for it yet.

require('dotenv').config(); // loads env vars (don't need in prod)

// built-in requires
const path = require('path');

// main base tech stack requires
const express = require('express');
const app = express();

// other base tech stack requires
const favicon = require('serve-favicon');

// database requires
const mongoose = require('mongoose'); // already includes mongoDB

// security requires
const helmet = require('helmet');
const sanitizer = require('sanitizer'); // where will I be using sanitizer?
const limiter = require('limiter'); // where will I be using limiter?
const uuid = require('node-uuid'); // for the nonce, though I may not need it required here...along with other 'requires'; since not using email confirm, no need...

// performance requires
const compression = require('compression'); // where am I using this?

// authentication and its dependency requires
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // move store from mem to mongo
const passport = require('passport');


// development requires
const morgan = require('morgan');


// custom requires
const port = process.env.PORT || 5000;
const routes = require('./app/server/routes');
const config = require('./app/server/config');
const User = require('./app/server/models/user');

mongoose.connect(config.dbURL);
mongoose.connection.on('error', () => {
    console.log('Error: Could not connect to MongoDB. Did you forget to run "mongod"?');
});


require('./app/server/controllers/middlewares/passport')(passport); // pass passport for configuration.

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/app/server/views'));
app.locals.basedir = app.get('views'); // allows for pug includes


//app.listen(5000, () => { console.log("Running on 5000."); });
app.set('port', port);

app.use(compression());
app.use(helmet()); // can set up CSP against XSS attacks. 7/10 of its headers implemented by default.
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(favicon(path.join(__dirname, '/static/img/favicon.ico')));



app.use(morgan('dev')); // log every request to console.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false, // no ability for non-authorized; no reason to save.
    cookie: { secure: 'auto' } // didn't specify true as working between dev/prod. auto automatically determines, however if set on https then going to http will not show cookie.
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


routes(app, passport); // apparently it doesn't matter if this is before or after the port is set...

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});


