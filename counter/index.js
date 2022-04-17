const express = require('express');
const counterRouter = require('./routes/counter');

const PORT = process.env.PORT || 3000;
const app = express();

app.use('/counter', counterRouter);

app.listen(PORT, () => {
    console.log(`Server is running, PORT=${PORT}`)
});