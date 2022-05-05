const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: false
    },
    favorite: {
        typ: String,
        required: false
    },
    fileCover: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: false
    },
    fileBook: {
        type: String,
        required: false
    }
});

module.exports = model('Book', bookSchema);