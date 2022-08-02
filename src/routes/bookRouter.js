const express = require('express')
const bookModel = require('../models/book_model')
const userModel = require('../models/user_model')

const router = express.Router()

router.get('/menu', async (req, res) => {
    res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
})

router.get('/books', async (req, res) => {
    try {
        const { accountId } = req.user
        const booksList = await bookModel.find({ accountId })
        res.render("listBooks", { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Не удалось получить список книг' })
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
        res.render("error", { title: '404 | Книга не найдена' })
    }
})

router.post('/books/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        await bookModel.deleteOne({ _id: id })
        res.render("menu", { title: 'Список книг' });
    } catch (e) {
        res.status(404)
        res.render("error", { title: 'Что-то пошло не так. Не удалось удалить книгу' })
    }
})

router.get('/createBook', (req, res) => {
    res.render("createBook", { title: "Добавьте книгу", book: {} });
})

router.post('/createBook', async (req, res) => {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body
    console.log('req.user', req.user)
    const { accountId } = req.user
    console.log('accountId', accountId)
    const newBook = new bookModel({ accountId, title, description, authors, favorite, fileCover, fileName, fileBook })

    try {
        await newBook.save()
        const booksList = await bookModel.find()
        res.status(201)
        res.render('listBooks', { booksList, title: 'Список книг' });
    }
    catch (e) {
        console.log(e)
        res.render("error", { title: 'Не удалось создать книгу' })
    }
})

router.get('/editBook/:id', async (req, res) => {
    const { id } = req.params;
    const selectedBook = await bookModel.findById(id).select('-__v')

    if (selectedBook) {
        res.render("editBook", { book: selectedBook, title: 'Редактирование' });

    } else {
        res.status(404)
        res.render("error", { title: '404 | Книга не найдена' })
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
        res.render("error", { title: '404 | Книга не найдена' })
    }
})

router.get('/books/:id/download', (req, res) => {
    const { id } = req.params
    const { booksList } = bookStore
    const book = booksList.find(book => book.id === id);
    if (!book) {
        res.status(404)
        res.render("error", { title: '404 | Книга не найдена' })
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