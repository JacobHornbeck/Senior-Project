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
    const currentUser = this.userId.toString()
    const emailsToNotify = []

    const addToList = (email) => {
        if (emailsToNotify.length < 1 || !emailsToNotify.includes(email))
            emailsToNotify.push(email)
    }

    if (this.connectedContentType == 'Project' && !this.connectedMessage) {
        let message = await this.populate('connectedContent')
            message = await message.populate('connectedContent.userId')
        console.log(message.connectedContent.userId.email)
        addToList(message.connectedContent.userId.email)
    }
    if (this.connectedMessage) {
        let message = await this.populate('connectedMessage')
            message = await message.populate('connectedMessage.userId')
        
        if (message.connectedMessage) {
            message = await message.populate('connectedMessage.connectedMessage')
            message = await message.populate('connectedMessage.connectedMessage.userId')
        }

        console.log(message)
    }
    console.log(emailsToNotify)
}

module.exports = mongoose.model('Message', messageSchema)