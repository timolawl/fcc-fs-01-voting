'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');

var config = require('./config');
var Poll = require('./models/poll');

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.set('port', (process.env.PORT || 5000));
app.use('/public', express.static(process.cwd() + '/public'));
app.use(favicon(process.cwd() + '/public/images/favicon.ico'));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

