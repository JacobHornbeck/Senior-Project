const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
    thingId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    imgs: {
        type: [String],
        required: true
    },
    tags: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('Card', cardSchema)