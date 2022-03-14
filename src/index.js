const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const errorMiddleware = require('./middleware/error');

const userApiRouter = require('./routes/api/user');
const bookApiRouter = require('./routes/api/book');

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

app.use(cors());
app.use('/', indexRouter);
app.use('/books', bookRouter);
app.use('/api/user', userApiRouter);
app.use('/api/books', bookApiRouter);

app.use(errorMiddleware);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running, go to http://localhost:${PORT}/`)
});