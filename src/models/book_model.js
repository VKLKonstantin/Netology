const { Schema, model } = require('mongoose')

const bookSchema = new Schema({
    title: { type: String },
    description: { type: String },
    authors: { type: String },
    favorite: { type: String },
    fileCover: { type: String },
    fileName: { type: String },
})


module.exports = model('bookModel', bookSchema)



