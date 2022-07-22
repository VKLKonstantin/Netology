const express = require('express')
const middlewareRouter = require('./routes/middlewareRouter')
const bookRouter = require('./routes/bookRouter')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3002
const UrlDB = process.env.UrlDB || 'mongodb+srv://admin:yUSIEYdSvm3kqMHg@cluster0.0b3fxfl.mongodb.net/?retryWrites=true&w=majority'

app.use(express.urlencoded());
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use('/myUploads', express.static(__dirname + 'routes/myUploads'));
app.use(express.static("public"));
app.use('/api', bookRouter);
app.use('/middlewareLoadBook', middlewareRouter);
app.use('/', (req, res) => {
    res.render("menu", { title: "Добро пожаловать в библиотеку!" });
})

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
