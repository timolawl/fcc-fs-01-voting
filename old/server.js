'use strict';

require('dotenv').config();

var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./app/routes');
var configDB = require('./config/database');
var configSession = require('./config/session');
var User = require('./models/user');
//var Poll = require('./models/poll');


mongoose.connect(configDB.url);
mongoose.connection.on('error', function() {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

require('./config/passport')(passport); // pass passport for configuration

app.set('port', port);
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(process.cwd() + '/public/img/favicon.ico'));

app.use(morgan('dev')); // log every request to the console.
// use the individual methods by itself bodyParser.urlencoded() etc..
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
    secret: configSession.secret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

routes(app, passport);

// If it gets to this point, then the path specified was bad.
app.use(function(req, res) {
    res.status(400).send('Bad Request');
});

// next step to set up authentication and load the auth
// don't need all these connection types. better to have only just one.
// or you know what, just yolo it.

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

