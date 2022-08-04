const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    accountId: { type: String },
    userName: { type: String,  required: true },
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})


module.exports = model('userModel', UserSchema)
