'use strict';

module.exports = (app, passport) => {
    app.route('/')
       .get((req, res) => {
            res.render('index', { pageTitle:'Hey' });
        });

    app.route('/test')
        .get(isLoggedIn, (res, req) => {
            res.send('Okay!');
        });

    app.use((req, res) => { res.status(400).send('Bad request.'); });
};

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) // isAuthenticated is a passport JS add-on method
        return next();

    res.send('Uh oh...');
}
