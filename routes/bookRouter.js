const express = require('express')
const { v4: uuid } = require('uuid')

const router = express.Router()
const fileMulter = require('../middleware')

class Book {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", id = uuid()) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const bookStore = {
    booksList: [
        new Book("book1", "description", "authors", "favorite", "fileCover", "1655208206713-red-book-png.jpg"),
        new Book("book2"),
        new Book("book3"),
        new Book("book4"),
    ],
};

router.get('/books', (req, res) => {
    const { booksList } = bookStore
    res.json(booksList)
})

router.get('/books/:id', (req, res) => {

    const { id } = req.params
    const { booksList } = bookStore
    const indexBook = booksList.findIndex(element => element.id === id)

    if (indexBook !== -1) {
        res.json(booksList[indexBook])
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.post('/user/login', (req, res) => {
    const { myEmail } = req.body
    res.status(201)
    res.json(myEmail)
})

router.post('/addBooks', fileMulter.single('book'), (req, res) => {
    const { booksList } = bookStore
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    if (req.file) {
        const fileBook = req.file;
        const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
        booksList.push(newBook)
        res.status(201)
        res.json(newBook)
    }

    else {
        res.json(null);
    }




    // booksList.fileBook = ""
    // const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    // booksList.push(newBook)

    // res.status(201)
    // res.json(newBook)
})


router.put('/editBook/:id', (req, res) => {
    const { booksList } = bookStore
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const { id } = req.params

    const indexBook = booksList.findIndex(element => element.id === id)

    if (indexBook !== -1) {
        booksList[indexBook] = {
            ...booksList[indexBook],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        }

        res.json(booksList[indexBook])
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.delete('/deleteBook/:id', (req, res) => {
    const { booksList } = bookStore
    const { id } = req.params
    const indexBook = booksList.findIndex(el => el.id === id)

    if (indexBook !== -1) {
        booksList.splice(indexBook, 1)
        res.json("ok")
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.get('/books/:id/download', (req, res) => {
    const { id } = req.params
    const { booksList } = bookStore
    const book = booksList.find(book => book.id === id);
    if (!book) {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
    console.log('book', book)
    const fileName = book.fileName;
    console.log('fileName', fileName)
    console.log('__dirname', __dirname)
    // res.download(__dirname +`/myUploads/${fileName}`);
    res.download(__dirname + `/myUploads/${fileName}`, `${book.fileName}`, err => {
        if (err) {
            res.json(err)
        }
    });

})

module.exports = router