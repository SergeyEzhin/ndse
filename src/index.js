const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const errorMiddleware = require('./middleware/error');

// const userApiRouter = require('./routes/api/user');
// const bookApiRouter = require('./routes/api/book');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'books';
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));      

app.set("view engine", "ejs");

app.use(cors());
app.use('/', indexRouter);
app.use('/books', bookRouter);
// app.use('/api/user', userApiRouter);
// app.use('/api/books', bookApiRouter);

app.use(errorMiddleware);

async function start() {
    try {
        await mongoose.connect(HostDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
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