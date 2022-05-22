const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    profileBackground: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    emailConfirmed: {
        type: Boolean,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    editorTheme: {
        type: String,
        required: false
    },
    resetToken: String,
    resetTokenExpiration: Date
})

module.exports = mongoose.model('User', userSchema)