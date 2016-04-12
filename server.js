'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');

var config = require('./config');
var User = require('./models/user');
var Poll = require('./models/poll');

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

app.set('port', (process.env.PORT || 5000));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(process.cwd() + '/public/img/favicon.ico'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html'); // use for now.
});

// If it gets to this point, then the path specified was bad.
app.use(function(req, res) {
    res.status(400).send('Bad Request');
});

// next step to set up authentication and load the auth

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

