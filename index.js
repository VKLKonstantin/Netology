
const express = require('express')
const { v4: uuid } = require('uuid')

const myEmail = { id: 1, mail: "test@mail.ru" }

class Book {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", id = uuid()) {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
    }
}

const bookStore = {
    booksList: [
        new Book("book1"),
        new Book("book2"),
        new Book("book3"),
        new Book("book4"),
    ],
};

const app = express()
app.use(express.json())

app.get('/api/books', (req, res) => {
    const { booksList } = bookStore
    res.json(booksList)
})

app.get('/api/books/:id', (req, res) => {

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

app.post('/api/user/login', (req, res) => {
    const { myEmail } = req.body
    res.status(201)
    res.json(myEmail)
})

app.post('/api/addBooks', (req, res) => {
    const { booksList } = bookStore
    const { title, description, authors, favorite, fileCover, fileName } = req.body
    const newBook = new Book(title, description, authors, favorite, fileCover, fileName)
    booksList.push(newBook)

    res.status(201)
    res.json(newBook)
})


app.put('/api/editBook/:id', (req, res) => {
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
            fileName
        }

        res.json(booksList[indexBook])
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

app.delete('/api/deleteBook/:id', (req, res) => {
    const { booksList } = bookStore
    const {id} = req.params
    const indexBook = booksList.findIndex(el => el.id === id)
     
    if(indexBook !== -1){
        booksList.splice(indexBook, 1)
        res.json("ok")
    } else {
        res.status(404)
        res.json('404 | Книга не найдена')
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT)

