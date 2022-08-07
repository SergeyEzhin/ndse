const express = require('express');
const http = require('http');
const socket = require('socket.io');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./config/keys').MongoURI;
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const passportConfig = require('./config/passport');

const formatMessage = require('../utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('../utils/users');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');
const userRouter = require('./routes/user');
const bookApiRouter = require('./routes/api/book');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socket(server);

// Set static folder
app.use(express.static("public"));

const botName = 'LibraryBot';

// Run when client connects
io.on('connection', socket => {
    // console.log('New WS connection', socket);
    socket.on('joinRoom', ({ username, room }) => {
        // console.log(username, room);
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to book chat'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
    });
});

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

        server.listen(PORT, () => {
            console.log(`Server is running, go to http://localhost:${PORT}/`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();


