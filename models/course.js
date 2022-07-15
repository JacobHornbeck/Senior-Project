const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    articles: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
    }],
    tags: [{
        type: String,
        required: false
    }]
})

module.exports = mongoose.model('Course', courseSchema)