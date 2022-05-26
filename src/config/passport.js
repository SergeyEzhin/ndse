const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy(
            {usernameField: 'email'},
            (email, password, done) => {
                // Match User
                User.findOne({email: email})
                    .then(user => {
                        if(!user) {
                            console.log('This email is not registered');
                            return done(null, false, {message: 'This email is not registered'});
                        }

                        // Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err;
                            if(isMatch) {
                                return done(null, user);
                            } else {
                                console.log('Password incorrect');
                                return done(null, false, {message: 'Password incorrect'});
                            }
                        });

                    })
                    .catch(err => console.log(err))
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}