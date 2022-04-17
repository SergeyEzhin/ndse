const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const router = express.Router();
const uidGenerator = require('node-unique-id-generator');
const { Book } = require('../models');
const fileMiddleware = require('../middleware/file');
const urlencodedParser = express.urlencoded({extended: false});

const store = {
    books: []
};

[1, 2, 3].map(el => {
    const newBook = new Book(uidGenerator.generateUniqueId(), `Book ${el}`, `Desc book ${el}`);
    store.books.push(newBook);
});

router.get('/', (req, res) => {
    const { books } = store;

    res.render("book/index", {
        title: "Books",
        books
    });
});

router.get('/create', (req, res) => {
    res.render("book/create", {
        title: 'Book create',
        book: {}
    });
});

router.post('/create', fileMiddleware.single('file-book'), (req, res) => {
    const { books } = store;
    const { title, desc } = req.body;
    let newBook = new Book(uidGenerator.generateUniqueId(), title, desc);

    if (req.file) {
        const { path, originalname } = req.file;

        newBook = {
            ...newBook,
            fileBook: path,
            fileName: originalname
        };
    }

    books.push(newBook);

    res.redirect('/books');
});

router.get('/:id', async (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);
    let count;

    if (idx !== -1) {
        try {
            const response = await fetch(`http://counter:3002/counter/${id}/incr`, {
                method: 'POST'
            });
            count = await response.json();
        } catch(e) {
            console.log(e)
        }

        console.log(count);
        
        res.render("book/view", {
            title: 'Book view',
            book: books[idx],
            count
        })
    } else {
        res.status(404).redirect('/404');
    }
});

router.get('/update/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if(idx !== -1) {
        res.render("book/update", {
            title: 'Book update',
            book: books[idx]
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/update/:id', fileMiddleware.single('file-book'), (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const { title, description } = req.body;
    const idx = books.findIndex(book => book.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description
        }
        res.redirect(`/books/${id}`);
    } else {
        res.status(404).redirect('/404');
    }

});

router.post('/delete/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if(idx !== -1) {
        books.splice(idx, 1);
        res.redirect(`/books`);
    } else {
        res.status(404).redirect('/404');
    }
});

router.get('/download/:id', (req, res) => {
    const { books } = store;
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if(idx !== -1) {
        res.download(__dirname + '/../' + books[idx].fileBook, `${books[idx].fileName}`, err => {
            if (err) {
                res.status(404).redirect('/404');
            }
        });
    } else {
        res.status(404).redirect('/404');
    }
});

module.exports = router;

