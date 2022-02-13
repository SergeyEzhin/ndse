class Todo {
    constructor(id = "", title = "", description = "", 
    authors = "", favorite = "", fileCover = "", fileName = "") {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }
}

module.exports = Todo;