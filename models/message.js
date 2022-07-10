const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    votes: {
        type: Number,
        default: 1
    },
    sendDate: {
        type: Date,
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'question',
            'answer',
            'comment'
        ]
    },
    connectedMessage: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Message'
    },
    connectedContent: {
        type: String,
        required: true
    },
    connectedContentType: {
        type: String,
        required: true,
        enum: [
            'project',
            'article',
            'reference',
            'tutorial'
        ]
    }
})

module.exports = mongoose.model('Message', messageSchema)