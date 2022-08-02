const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
    accountId: { type: String },
    title: { type: String },
    description: { type: String },
    authors: { type: String },
    favorite: { type: String },
    fileCover: { type: String },
    fileName: { type: String },
})


module.exports = model('bookModel', bookSchema)



