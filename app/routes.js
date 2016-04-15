module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs');
    //  res.sendFile(process.cwd() + '/views/index.html'); // use for now.
    });


    app.route('/login')
        .get(function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        })

        .post(passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));


    app.route('/signup')

       .get(function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        })

       .post(passport.authenticate('local-signup', {
            // http://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
            successRedirect: '/profile', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to signup page if error
            failureFlash: true // allow flash messages
        }));


    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', { user: req.user }); // get the user out of session and pass to template?

    });

    app.get('/logout', function(req, res) {
        req.logout(); // provided by passport.
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


