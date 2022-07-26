const express = require('express')
const bookModel = require('../models/book_model')
const registarationModel = require('../models/registration_model')

const router = express.Router()

router.get('/menu', async (req, res) => {
    res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
})

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

router.post('/books/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        await bookModel.deleteOne({ _id: id })
        res.render("menu", {title: 'Список книг' });
    } catch (e) {
        res.status(404)
        res.json('Не удалось удалить книгу')
    }
})

router.get('/registration', (req, res) => {
    res.render("registration", { title: "Регистрация" });
})

router.post('/registration', async (req, res) => {
    const { login, password } = req.body;

    const credits = new registarationModel({ login, password })
    console.log('credits', credits)
    try {
        await credits.save()
        res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
    }
    catch (e) {
        console.log(e)
    }
})
router.get('/login', (req, res) => {
    res.render("login", { title: "Вход" });
})

router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const auth = await registarationModel.findOne({ login, password })
        console.log(auth)
        if (auth) {
            res.render("menu", { title: 'Добро пожаловать в Ваш личный кабинет' });
        }
        else {
            res.json('Вам нужно зарегистрироваться')
        }
    }
    catch (e) {
        console.log(e)
    }
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