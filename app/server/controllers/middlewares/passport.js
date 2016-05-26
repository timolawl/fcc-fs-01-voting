'use strict';

const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/user');

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
            User.findOne({ 'local.username': username }, (err, user) => {
                if (err) {
                    console.log('user already exists.');
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    console.log('adding new user');
                    const newUser = new User();
                    newUser.local.username = username;
                    newUser.local.email = req.params.email; // is this how it works?
                    newUser.local.password = password;

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
        });
    }
    
    ));

};

