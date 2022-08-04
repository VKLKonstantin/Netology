const express = require('express')
const session = require('express-session')
const passport = require('passport')
const middlewareRouter = require('./routes/middlewareRouter')
const bookRouter = require('./routes/bookRouter')
const userRouter = require('./routes/userRouter')
const chatRouter = require('./routes/chatRouter')
const mongoose = require('mongoose')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const chatModel = require('./models/chat_model')

const PORT = process.env.PORT || 3002
const UrlDB = process.env.UrlDB || 'mongodb+srv://admin:yUSIEYdSvm3kqMHg@cluster0.0b3fxfl.mongodb.net/?retryWrites=true&w=majority'

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
    .use('/chat', chatRouter)
    .use('/api', bookRouter)
    .use('/middlewareLoadBook', middlewareRouter)
    .use('/', (req, res) => {
        res.render("start", { title: "Добро пожаловать в библиотеку!" });
    })

const server = http.Server(app)
const io = socketIO(server)

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

        server.listen(PORT, () => { `Сервер запущен на ${PORT}` })
    }
    catch (e) {
        console.log(e)
    }
}

io.on('connection', (socket) => {
    const { id } = socket;
    console.log(`Socket connected: ${id}`);

    const { roomName } = socket.handshake.query;
    console.log(`Socket roomName: ${roomName}`);
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        console.log('msg111', msg)
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);

        const message = new chatModel({ idBook: msg.idBook, date: msg.date, userName: msg.username, comment: msg.comment })
        try {
            message.save()
            console.log('ok')
        }
        catch (e) {
            console.log(e)
            res.render("error", { title: 'Ваше сообще не отправлено' })
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});
start(PORT, UrlDB)