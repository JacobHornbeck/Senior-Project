const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = require('../models/message')
const Vote = require('../models/vote')

const tutorialSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    }
})

tutorialSchema.methods.getMessages = async function(userId = '') {
    const messages = await Message.find({ connectedContent: this._id.toString(), connectedContentType: 'Tutorial' })
                                  .populate({ path: 'userId', select: ['displayName'] })
                                  .sort({ "type": -1, "votes": -1, "sendDate": -1 })

    const votes = userId != '' ? await Vote.find({ userId: userId }) : []
    const gMessages = messages.filter(msg => !msg.connectedMessage)
    const otherMessages = messages.filter(msg => msg.connectedMessage)
    return gMessages.map((message) => {
        let connectedComments = []
        for (let i = 0; i < otherMessages.length; i++) {
            if (otherMessages[i].connectedMessage.toString() == message._id.toString() && otherMessages[i].type == "comment")
                connectedComments.push(otherMessages[i])
        }
        connectedComments.sort((a, b) => {
            return a.sendDate - b.sendDate
        })
        let answers = []
        for (let i = 0; i < otherMessages.length; i++) {
            if (otherMessages[i].connectedMessage.toString() == message._id.toString() && otherMessages[i].type == "answer")
                answers.push(otherMessages[i])
        }
        answers.sort((a, b) => {
            return a.sendDate - b.sendDate
        })
        for (let a = 0; a < answers.length; a++) {
            let answerComments = []
            for (let i = 0; i < otherMessages.length; i++) {
                if (otherMessages[i].connectedMessage.toString() == answers[a]._id.toString() && otherMessages[i].type == "comment") {
                    answerComments.push(otherMessages[i])
                }
            }
            answerComments.sort((a, b) => {
                return a.sendDate - b.sendDate
            })
            answers[a].comments = answerComments
            answers[a].activatedUp = (votes.filter((vote) => {
                    return (vote.messageId.toString() == answers[a]._id.toString() && vote.direction == 'up')
                }).length > 0)
            answers[a].activatedDown = (votes.filter((vote) => {
                    return (vote.messageId.toString() == answers[a]._id.toString() && vote.direction == 'down')
                }).length > 0)
        }

        message = {
            ...message._doc,
            activatedUp: (votes.filter((vote) => {
                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'up')
            }).length > 0),
            activatedDown: (votes.filter((vote) => {
                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'down')
            }).length > 0),
            comments: connectedComments,
            answers: answers
        }
        return message
    })
}

module.exports = mongoose.model('Tutorial', tutorialSchema)