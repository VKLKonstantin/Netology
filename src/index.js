const express = require('express')
const middlewareRouter = require('./routes/middlewareRouter')
const bookRouter = require('./routes/bookRouter')
const redis = require('redis')

const app = express()
const PORT = process.env.PORT || 3002

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
app.listen(PORT, () => { `Сервер запущен на ${PORT}` })