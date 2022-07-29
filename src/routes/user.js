const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render("auth/register", {
        title: 'Registration'
    });
});

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render("auth/login", {
        title: 'Login'
    });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render("auth/profile", {
        title: 'Profile',
        name: req.user.name
    });
});

router.post('/register', (req, res) => {
    const {name, email, password, passwordRepeat} = req.body;
    let errors = [];

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
        res.render('auth/register', {
            title: 'Registration',
            errors,
            name,
            email,
            password,
            passwordRepeat,
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email already registered' });
                res.render('auth/register', {
                    title: 'Registration',
                    errors,
                    name,
                    email,
                    password,
                    passwordRepeat,
                });
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
                        newUser.save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
});

module.exports = router;