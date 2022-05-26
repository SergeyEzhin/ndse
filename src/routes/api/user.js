const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated} = require('../../config/auth');
const passport = require('passport');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/api/user/me',
        failureRedirect: '/api/user/login'
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    console.log('You are logged out');
    req.logout();
    res.redirect('/api/user/login');
});

router.post('/signup', (req, res) => {
    const {name, email,  password, passwordRepeat} = req.body;
    let errors = [];
    console.log(req.body);

    if (!name || !email || !password || !passwordRepeat) {
        errors.push({ msg: 'Please enter all fields' });
    }
    
    if (password !== passwordRepeat) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.json(errors);
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.json(errors);
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.redirect('/api/user/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.get('/signup', forwardAuthenticated, (req, res) => {
    res.json('Sign Up Page');
});

router.get('/login', forwardAuthenticated, (req, res) => {
    res.json('Login Page');
});

router.get('/me', ensureAuthenticated, (req, res) => {
    res.json(req.user);
});

module.exports = router;