const express = require('express')
const session = require('express-session')
const passport = require('passport')
const middlewareRouter = require('./routes/middlewareRouter')
const bookRouter = require('./routes/bookRouter')
const userRouter = require('./routes/userRouter')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3002
const UrlDB = process.env.UrlDB || 'mongodb+srv://admin:yUSIEYdSvm3kqMHg@cluster0.0b3fxfl.mongodb.net/?retryWrites=true&w=majority'

async function start(PORT, UrlDB) {
    try {
        await mongoose
            .connect(UrlDB)
            .then(() => {
                console.info('Connected to MONGO.');
            })
            .catch((error) => {
                console.error('Failed to connect to: MONGO.', error);

                return process.exit(1);
            });

        app.listen(PORT, () => { `Сервер запущен на ${PORT}` })
    }
    catch (e) {
        console.log(e)
    }
}

start(PORT, UrlDB)
const app = express()
.set('view engine', 'ejs')
.set('views', './src/views')
.use(express.urlencoded())
.use(session({ secret: 'SECRET' }))
.use(passport.initialize())
.use(passport.session())
.use('/myUploads', express.static(__dirname + 'routes/myUploads'))
.use(express.static("public"))
.use('/user', userRouter)
.use('/api', bookRouter)
.use('/middlewareLoadBook', middlewareRouter)
.use('/', (req, res) => {
    res.render("start", { title: "Добро пожаловать в библиотеку!" });
})

