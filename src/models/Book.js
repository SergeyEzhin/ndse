class Book {
    constructor(id = "", title = "", description = "", 
    authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

module.exports = Book;