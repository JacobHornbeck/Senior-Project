const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Article', articleSchema)