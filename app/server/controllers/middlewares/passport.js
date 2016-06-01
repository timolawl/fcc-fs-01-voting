'use strict';

const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/user');
const email = require('./email'); // email middleware for sending emails

module.exports = passport => {

    //serialization/deserialization of user for session..
    // serialize called when user logs in
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialize the opposite, though explanation somewhat confusing:
    // takes the id stored in the session and we use that id to retrieve our user.
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true // allows for passing entire request to cb
    },
    (req, username, password, done) => {
        process.nextTick(() => { // need to check email too, not just username.
            User.findOne({ 'local.username': username }, (err, user) => {
                if (err) {
                    console.log('error finding username');
                    return done(err);
                }
                if (user) {
                    console.log('This username already exists.');
                    return done(null, false, req.flash('signupMessage', 'Username or email is already in use.'));
                } else {
                    // check for email here? 
                    User.findOne({ 'local.email': email }, (err, user) => {
                        if (err) {
                            console.log('error finding user email');
                            return done(err);
                        }
                        if (user) {
                            console.log('This email is already in use.');
                            return done(null, false, req.flash('signupMessage', 'Username or email is already in use.'));
                        } else {
                            console.log('adding new user');
                            const newUser = new User();
                            newUser.local.username = username;
                            newUser.local.email = req.params.email; // does this work?
                            newUser.local.password = password;
                            // need to make confirmation token (acct not yet active)
                            // during login, if acct found check if token exists
                            // if token exists then say that user needs to confirm
                            // if token does not exist, then assume confirmed?
                            // or maybe have a field to check confirmation status?

                            // save token, generate URL (need nodemailer/mailgun).

                            newUser.save(err => {
                                if (err) throw err;
                                done(null, newUser); // what am i doing here?
                                User.find({}, (err, users) => { // and here?
                                    if (err) throw err;
                                    console.log(users);
                                });
                            });
                        }
                    });
                }
            });
        });
    }
    
    ));

};

