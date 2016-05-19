'use strict';

const express = require('express');
const passport = require('passport');
const favicon = require('serve-favicon');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

const routes = require('./app/server/routes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/app/server/views'));
app.locals.basedir = app.get('views'); // allows for pug includes


//app.listen(5000, () => { console.log("Running on 5000."); });
app.set('port', port);
app.use('/static', express.static(path.join(__dirname,'/static')));
app.use(favicon(path.join(__dirname, '/static/img/favicon.ico')));

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});


routes(app, passport); // apparently it doesn't matter if this is before or after the port is set...
