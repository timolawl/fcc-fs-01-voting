'use strict';

module.exports = (app, passport) => {
    app.route('/')
       .get((req, res) => {
            res.render('index', { loggedIn: 'true', path: 'index' });
        });

    app.route('/signup')
        .get(isLoggedIn, (req, res) => {
            res.render('userform', { path: 'signup' });
        })
        .post(passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));

    app.route('/login')
        .get((req, res) => {
            res.render('userform', { path: 'login' }); // should I only have one file between signup and login? Just pass in an object to specify which is which?
        });

       // .post(

    app.route('/reset')
        .get((req, res) => {
            res.render('userform', { path: 'reset' });
        });

    app.route('/createpoll')
        .get((req, res) => {
            res.render('pollform'); // each option needs to pass through logIn middleware.
        });

    app.route('/mypolls')
        .get((req, res) => {
            res.render('mypolls', { path: 'mypolls' }); // use index?
        });

    app.use((req, res) => { res.status(400).send('Bad request.'); });
};

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) // isAuthenticated is a passport JS add-on method
        return next();

    res.redirect('/');
}
