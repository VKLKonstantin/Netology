const { Schema, model } = require('mongoose')

const ChatSchema = new Schema({
    idBook: { type: String },
    date: { type: String },
    userName: { type: String },
    comment: { type: String },
})

module.exports = model('chatModel', ChatSchema)
