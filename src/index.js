const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./config/keys').MongoURI;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const passportConfig = require('./config/passport');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');
const userRouter = require('./routes/user');
const bookApiRouter = require('./routes/api/book');

const PORT = process.env.PORT || 3000;
const app = express();

// Passport Config
passportConfig(passport);

// EJS
app.set("view engine", "ejs");

// Body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    secure: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(cors());
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/users', userRouter);
// app.use('/api/books', bookApiRouter);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => {
            console.log(`Server is running, go to http://localhost:${PORT}/`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();


