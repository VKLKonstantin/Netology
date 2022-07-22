const express = require('express')
const { v4: uuid } = require('uuid')
const redis = require('redis')
const bookModel = require('../models/book_model')

const router = express.Router()
const REDIS_URL = process.env.REDIS_URL || 'localhost'
const client = redis.createClient(`redis://${REDIS_URL}`)

router.get('/books', async (req, res) => {
    try {
        const booksList = await bookModel.find()
        res.render("listBooks", { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
        res.json(500, { error: 'Mongo error' })
    }

})

router.get('/books/:id', async (req, res) => {

    const { id } = req.params
    const booksList = await bookModel.find()

    const indexBook = booksList.findIndex(element => element.id === id)

    if (indexBook !== -1) {
        res.render("aboutBook", { book: booksList[indexBook], title: `Книга ${booksList[indexBook].title}` });
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.post('/books/:id', async (req, res) => {

    const { id } = req.params
    try {
        await bookModel.deleteOne({ _id: id })
        const booksList = await bookModel.find()
        res.render("listBooks", { booksList, title: 'Список книг' });
    } catch (e) {
        res.status(404)
        res.json('Не удалось удалить книгу')
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

router.post('/createBook', async (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body
    const newBook = new bookModel({ title, description, authors, favorite, fileCover, fileName, fileBook })

    try {
        await newBook.save()
        const booksList = await bookModel.find()
        res.status(201)
        res.render('listBooks', { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
    }
})

router.get('/editBook/:id', async (req, res) => {
    const { id } = req.params;
    const selectedBook = await bookModel.findById(id).select('-__v')

    if (selectedBook) {
        res.render("editBook", { book: selectedBook, title: 'Редактирование' });

    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

router.post('/editBook/:id', async (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const { id } = req.params
    try {
        await bookModel.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover, fileName })
        const booksList = await bookModel.find()
        res.render("listBooks", { booksList, title: 'Список книг' });
    }
    catch (e) {
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

module.exports = router