const mongoose = require('mongoose')
const Schema = mongoose.Schema

const voteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    messageId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Message'
    },
    direction: {
        type: String,
        enum: ['up', 'down'],
        required: true
    }
})

module.exports = mongoose.model('Vote', voteSchema)