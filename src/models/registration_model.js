const { Schema, model } = require('mongoose')

const registrationSchema = new Schema({
    login: { type: String },
    password: { type: String },
})


module.exports = model('registarationModel', registrationSchema)
