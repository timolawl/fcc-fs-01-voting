'use strict';

var QueryHandler = require(process.cwd() + '/app/controllers/queryHandler.server.js');

module.exports = function (app, db) {

    var queryHandler = new QueryHandler(db);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });

    app.route(/^\/api\/imagesearch\/.+/) // image search
        .get(queryHandler.getSearch); // get image search results

    app.route(/^\/api\/latest\/?$/)  // recent searches
        .get(queryHandler.getRecent);

    app.use(function (req, res) {   // default response for any other path
        res.status(400).send('Bad Request');
    });
};
