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
    // connectedContent: {
    //     type: Schema.Types.ObjectId,
    //     required: true
    // }
})

module.exports = mongoose.model('Message', messageSchema)