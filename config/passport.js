// config/passport.js
//
// // load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // passport session setup
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // local signup
    // using named strategies since there is one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password; override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the cb
    },
    function(req, email, password, done) {
        // https://howtonode.org/understanding-process-next-tick
        // force async?
        // User.findOne will not fire unless data is sent back
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // does the user already exist?
            User.findOne({ 'local.email': email }, function(err, user) {
                if (err) {
                    console.log('uh oh error');
                    return done(err);
                }
                if (user) {
                    console.log('user already exists.');
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }
                else {
                    console.log('adding new user');
                    // if there is no use with that email, create user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = password; // password is hashed on save

                    // save the user
                    newUser.save(function(err) {
                        if (err) throw err;
                        done(null, newUser); // no need to return because save is async
                        User.find({}, function(err, users) {
                            if (err) throw err;
                            console.log(users);
                        });
                    });
                }
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email': email }, function(err, user) {
            if (err)
                return done(err);

            // if not user, flash incorrect message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'Incorrect email/password or account does not exist.'));
            else {
                // if user is correct, compare password.
                user.comparePassword(password, function(err, isMatch) {
                    if (err) throw err;

                    // if password is incorrect flash incorrect message
                    if (!isMatch)
                        return done(null, false, req.flash('loginMessage', 'Incorrect email/password or account does not exist.'));
                    else return done(null, user);
                });
            }
        });
    }));
};
