const mongoose = require('mongoose')
const Schema = mongoose.Schema

const editorThemes = require('../data/editorThemes')
const codeThemes = require('../data/codeThemes')

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
    displayName: {
        type: String,
        default: () => {
            return this.firstName + " " + this.lastName
        },
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    profileAvatar: {
        type: String,
        required: false,
        default: '00'
    },
    profileBackground: {
        type: String,
        required: false,
        default: '01'
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
        required: false,
        default: 'monokai',
        enum: editorThemes
    },
    editorLayout: {
        type: String,
        required: false,
        default: 'side-by-side',
        enum: [
            'side-by-side',
            'stacked'
        ]
    },
    codeTheme: {
        type: String,
        required: false,
        default: 'github-dark',
        enum: codeThemes
    },
    showLineNumbers: {
        type: Boolean,
        required: false,
        default: false
    },

    resetToken: String,
    resetTokenExpiration: Date
})

module.exports = mongoose.model('User', userSchema)