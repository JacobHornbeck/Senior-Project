const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = require('../models/message')
const Vote = require('../models/vote')

const projectSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: [
            "actionscript",
            "autohotkey",
            "batchfile",
            "c_cpp",
            "clojure",
            "cobol",
            "coffee",
            "csharp",
            "css",
            "django",
            "ejs",
            "erlang",
            "fortran",
            "fsharp",
            "golang",
            "groovy",
            "handlebars",
            "haskell",
            "html",
            "java",
            "javascript",
            "json",
            "kotlin",
            "less",
            "lisp",
            "lua",
            "markdown",
            "matlab",
            "mysql",
            "objectivec",
            "pascal",
            "perl",
            "php",
            "powershell",
            "python",
            "ruby",
            "rust",
            "sass",
            "scss",
            "sql",
            "sqlserver",
            "svg",
            "swift",
            "typescript",
            "xml"
        ]
    },
    title: {
        type: String,
        required: true
    },
    saveDate: {
        type: Date,
        required: true
    },
    editDate: {
        type: Date,
        required: false
    }
})

projectSchema.methods.getMessages = async function(userId) {
    const messages = await Message.find({ connectedContent: this._id.toString(), connectedContentType: 'Project' })
                                  .populate({ path: 'userId', select: ['displayName'] })
                                  .sort({ "type": -1, "votes": -1, "sendDate": -1 })

    const votes = await Vote.find({ userId: userId })
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

module.exports = mongoose.model('Project', projectSchema)