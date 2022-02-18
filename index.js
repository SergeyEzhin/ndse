const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');

const errorMiddleware = require('./middleware/error');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running, go to http://localhost:${PORT}/`)
});