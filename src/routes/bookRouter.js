const express = require('express')
const { v4: uuid } = require('uuid')
const redis = require('redis')

const router = express.Router()
const REDIS_URL = process.env.REDIS_URL || 'localhost'
const client = redis.createClient(`redis://${REDIS_URL}`)

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
        new Book("book1", "description1", "authors1", "favorite1", "fileCover1", "1655208206713-red-book-png.jpg"),
        new Book("book2", "description2", "authors2", "favorite2", "fileCover2", "1655217067842-blue-books.jpg"),
        new Book("book3", "description3", "authors3", "favorite3", "fileCover3", ""),
        new Book("book4", "description4", "authors4", "favorite4", "fileCover4", ""),
    ],
};

router.get('/books', (req, res) => {
    const { booksList } = bookStore
    res.render("listBooks", { booksList, title: 'Список книг' });
})

router.get('/books/:id', (req, res) => {

    const { id } = req.params
    const { booksList } = bookStore
    const indexBook = booksList.findIndex(element => element.id === id)

    if (indexBook !== -1) {
        res.render("aboutBook", { book: booksList[indexBook], title: `Книга ${booksList[indexBook].title}` });
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

router.get('/createBook', (req, res) => {
    res.render("createBook", { title: "Добавьте книгу", book: {} });
})

router.post('/createBook', (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body
    const { booksList } = bookStore
    console.log('authors', JSON.stringify(authors))
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    booksList.push(newBook)

    if (req.file) {
        const fileBook = req.file;
        const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
        booksList.push(newBook)
        res.status(201)
        res.render('listBooks', { booksList, title: 'Список книг' });
    }
    else {
        res.render('listBooks', { booksList, title: 'Список книг' });
    }
})

router.get('/editBook/:id', (req, res) => {
    const { id } = req.params;
    const { booksList } = bookStore
    const indexBook = booksList.findIndex(element => element.id === id)
    console.log('indexBook', indexBook)
    if (indexBook !== -1) {
        res.render("editBook", { book: booksList[indexBook], title: 'Редактирование' });

    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.post('/editBook/:id', (req, res) => {
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

        res.render("listBooks", { booksList, title: 'Список книг' });
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
    res.download(__dirname + `/myUploads/${fileName}`, `${book.fileName}`, err => {
        if (err) {
            res.json(err)
        }
    });

})

router.get('/counter/:bookId', async (req, res) => {
    const { bookId } = req.params;

    const count = await client.get(bookId)
    res.json(count)
})

router.post('/counter/:bookId/incr', async (req, res) => {
    const { bookId } = req.params;
    try {
        const cnt = await client.incr(bookId)
        res.json({cnt})
    } catch (e) {
        res.statusCode(500).json('Error redis')
    }
})



module.exports = router