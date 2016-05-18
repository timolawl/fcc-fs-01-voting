'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

const routes = require('./app/routes');

app.set('view engine', 'pug');


routes(app); // apparently it doesn't matter if this is before or after the port is set...



//app.listen(5000, () => { console.log("Running on 5000."); });
app.set('port', port);

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});


