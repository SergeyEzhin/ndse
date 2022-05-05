const express = require('express');
const router = express.Router();
const uidGenerator = require('node-unique-id-generator');
const Book = require('../models/Book');
const fileMiddleware = require('../middleware/file');
// const urlencodedParser = express.urlencoded({extended: false});

router.get('/', async (req, res) => {
    const books = await Book.find();

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

router.post('/create', fileMiddleware.single('file-book'), async (req, res) => {
    const { title, desc } = req.body;
    let newBook = {
        title, desc
    };

    if (req.file) {
        const { path, originalname } = req.file;

        newBook = {
            ...newBook,
            fileBook: path,
            fileName: originalname
        };
    }

    newBook = new Book({...newBook});

    try {
        await newBook.save();
        res.redirect('/books');
    } catch(e) {
        console.error(e);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let book;

    try {
        book = await Book.findById(id);
    } catch(e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("book/view", {
        title: 'Book view',
        book
    });
});

router.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    let book;

    try {
        book = await Book.findById(id);
    } catch(e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.render("book/update", {
        title: 'Book update',
        book
    });
});

router.post('/update/:id', fileMiddleware.single('file-book'), async (req, res) => {
    const { id } = req.params;
    const { title, desc } = req.body;

    try {
        await Book.findByIdAndUpdate(id, {title, desc});
    } catch(e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books/${id}`);
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Book.deleteOne({_id: id});
    } catch(e) {
        console.error(e);
        res.status(404).redirect('/404');
    }

    res.redirect(`/books`);
});

// router.get('/download/:id', async (req, res) => {
//     // const { books } = store;
//     const { id } = req.params;
//     let book;
//     // const idx = books.findIndex(book => book.id === id);

//     try {
//         book = await Book.findById(id);

//         res.download(__dirname + '/../' + book.fileBook, `${book.fileName}`, err => {
//             if (err) {
//                 res.status(404).redirect('/404');
//             }
//         });

//     } catch(e) {
//         console.error(e);
//         res.status(404).redirect('/404');
//     }

//     // if(idx !== -1) {
//     //     res.download(__dirname + '/../' + books[idx].fileBook, `${books[idx].fileName}`, err => {
//     //         if (err) {
//     //             res.status(404).redirect('/404');
//     //         }
//     //     });
//     // } else {
//     //     res.status(404).redirect('/404');
//     // }
// });

module.exports = router;

