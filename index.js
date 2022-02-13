const express = require('express');
const cors = require('cors');
const uidGenerator = require('node-unique-id-generator');
const formData = require("express-form-data");
const { Book } = require('./models');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(formData.parse());
app.use(cors());

const store = {
    books: []
};

[1, 2, 3].map(el => {
    const newBook = new Book(uidGenerator.generateUniqueId(), `Book ${el}`, `Desc book ${el}`);
    store.books.push(newBook);
});

app.get('/api/books', (req, res) => {
    const { books } = store;
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if(idx !== -1) {
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("Book not found");
    }
});

app.post('/api/books', (req, res) => {
    const { books } = store;
    const { title, description } = req.body;
    const newBook = new Book(uidGenerator.generateUniqueId(), title, description);

    books.push(newBook);

    res.status(201);
    res.json(newBook);
});

app.post('/api/user/login', (req, res) => {
    res.status(201);
    res.json({id: 1, mail: 'test@mail.ru'});
});

app.put('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const { title, description } = req.body;
    const idx = books.findIndex(book => book.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
        };
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("Book not found");
    }
});

app.delete('/api/books/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.json(true);
    } else {
        res.status(404);
        res.json("Book not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running, go to http://localhost:${PORT}/`)
});