'use strict';

const LocalStrategy = require('passport-local').Strategy;

// will need to load the mongoose user model here later..

module.exports = passport => {
    /* for now to see if it is needed to test basic auth.
    //serialization/deserialization of user for session..
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) {
            done(err, user);
        });
    });
    */
/*  test out functionality with nothing here first.
 *  regardless I'll need to have some type of database representation for auth to validate.
 *  
 *
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true; // allows for passing entire request to cb
    },
    
    ));
*/
};

