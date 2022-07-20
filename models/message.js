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
    connectedContentType: {
        type: String,
        required: true,
        enum: [
            'Project',
            'Article',
            'Reference',
            'Tutorial'
        ]
    },
    connectedContent: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'connectedContentType'
    },
})

messageSchema.methods.getEmailsToNotify = async function() {
    const emailsToNotify = []
    let currentUser = await this.populate('userId')
        currentUser = currentUser.userId.email

    const addToList = (email) => {
        if (!currentUser || emailsToNotify.length < 1 || !emailsToNotify.includes(email))
            emailsToNotify.push(email)
    }

    if (this.connectedContentType == 'Project' && (!this.connectedMessage || this.type == 'answer')) {
        let message = await this.populate('connectedContent')
            message = await message.populate('connectedContent.userId')
        addToList(message.connectedContent.userId.email)
    }
    if (this.connectedMessage) {
        let message = await this.populate('connectedMessage')
            message = await message.populate('connectedMessage.userId')
        addToList(message.connectedMessage.userId.email)
    }

    return emailsToNotify
}
messageSchema.methods.getUsersToNotify = async function() {
    const usersToNotify = []
    let currentUser = this.userId.toString()

    const addToList = (userId) => {
        if (!currentUser || usersToNotify.length < 1 || !usersToNotify.includes(userId))
            usersToNotify.push(userId)
    }

    if (this.connectedContentType == 'Project' && (!this.connectedMessage || this.type == 'answer')) {
        let message = await this.populate('connectedContent')
        addToList(message.connectedContent.userId.toString())
    }
    if (this.connectedMessage) {
        let message = await this.populate('connectedMessage')
        addToList(message.connectedMessage.userId.toString())
    }

    return usersToNotify
}

module.exports = mongoose.model('Message', messageSchema)