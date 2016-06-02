'use strict';

// best I can do is check validity and existence of email.
const validator = require('validator');
const neverbounce = require('neverbounce')({
    apiKey: process.env.NB_KEY,
    apiSecret: process.env.NB_SECRET
});

const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/user');
// [WITH EMAIL]
// const email = require('./email'); // email middleware for sending emails

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
        process.nextTick(() => {
            User.findOne({ 'local.username': username.toLowerCase() }, (err, user) => { // will need to remove case sensitivity to test for existence of username and email.
                if (err) {
                    console.log('error finding username');
                    return done(err);
                }
                if (user) {
                    console.log('This username already exists.');
                    return done(null, false, req.flash('signupMessage', 'Username or email is already in use.'));
                } else {
                    // check email validity here:
                    console.log('checking validity..');
                    if (!validator.isEmail(req.body.email)) {
                        console.log('Provided email is not valid');
                        return done(null, false, req.flash('signupMessage', 'Entered email is not a valid email address.'));
                    }
                    // check email existence here:
                    console.log('checking existence..');

                    neverbounce.single.verify(req.body.email).then(
                        (result) => {
                            if (result.is(0)) { // valid email
                                User.findOne({ 'local.email': req.body.email.toLowerCase() }, (err, user) => {
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
                                        newUser.local.username = username.toLowerCase();
                                        newUser.local.email = req.body.email.toLowerCase(); // does this work?
                                        newUser.local.password = password;
                                        // [ WITH EMAIL ]
                                        // need to make confirmation token (acct not yet active)
                                        // during login, if acct found check if token exists
                                        // if token exists then say that user needs to confirm
                                        // if token does not exist, then assume confirmed?
                                        // or maybe have a field to check confirmation status?
                                        // save token, generate URL (need nodemailer/mailgun).
                                        newUser.save(err => {
                                            if (err) throw err;
                                            done(null, newUser); // what am i doing here? console logging the output?
                                            /*
                                            User.find({}, (err, users) => { // displaying all output to show.
                                                if (err) throw err;
                                                console.log(users);
                                            });
                                            */
                                        });
                                    }
                                });
                            } else {
                                console.log('Email address does not exist.');
                                // is the return needed for a promise?
                                return done(null, false, req.flash('signupMessage', 'Entered email does not exist.'));
                            }
                        },
                        (error) => {
                            console.error('Something went wrong with Neverbounce response (checking email existence)..', error);
                            // do I return done(err) here?
                        }
                    );
                 }
            });
        });
    }
    
    ));

};

