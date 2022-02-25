const express = require('express');
const router = express.Router();
const uidGenerator = require('node-unique-id-generator');
const { Book } = require('../../models');
const fileMiddleware = require('../../middleware/file');

const store = {
    books: []
};

[1, 2, 3].map(el => {
    const newBook = new Book(uidGenerator.generateUniqueId(), `Book ${el}`, `Desc book ${el}`);
    store.books.push(newBook);
});

router.get('/', (req, res) => {
    const { books } = store;
    res.json(books);
});

router.get('/:id', (req, res) => {
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

router.post('/', (req, res) => {
    const { books } = store;
    const { title, description } = req.body;
    const newBook = new Book(uidGenerator.generateUniqueId(), title, description);

    books.push(newBook);

    res.status(201);
    res.json(newBook);
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.post('/:id/upload',  
    (req, res, next) => {
        const { books } = store;
        const { id } = req.params;
        const idx = books.findIndex(book => book.id === id);

        if(idx !== -1) {
            next();
        } else {
            res.status(404);
            res.json('Incorrect ID book');
        }
    }, 
    fileMiddleware.single('file-book'), 
    (req, res) => {
        const { books } = store;
        const { id } = req.params;
        const idx = books.findIndex(book => book.id === id);
    
        if (req.file) {
            const { path, originalname } = req.file;

            books[idx] = {
                ...books[idx],
                fileBook: path,
                fileName: originalname
            };

            console.log(path);
            res.json(path);
        } else {
            res.json('No file');
        }
    }
);

router.get('/:id/download', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if(idx !== -1) {
        res.download(__dirname + '/../' + books[idx].fileBook, `${books[idx].fileName}`, err => {
            if (err) {
                res.status(404).json(null);
            }
        });
    } else {
        res.status(404).json('Incorrect ID book');
    }
});

module.exports = router;