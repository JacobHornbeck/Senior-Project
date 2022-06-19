const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const rateLimit = require("express-rate-limit")

const controller = require("../controllers/forum.js")
const Message = require("../models/message")
const User = require("../models/user")

const limiter = rateLimit({
    windowMs: 2000,
    max: 1
})

router
    .post('/post-message', [
        body('message-content')
            .isString()
            .isLength({ min: 10 })
            .withMessage('Message must be longer than 10 characters!')
            .trim(),
        body('message-type')
            .custom((value) => {
                const types = [
                    'question',
                    'answer',
                    'comment'
                ]
                if (types.includes(value))
                    return true
                else
                    throw new Error('Invalid message type!')
            }),
        body('username')
            .isLength({ min: 4 })
            .withMessage('Username must be longer than 4 characters!')
            .custom((value) => {
                return User.findOne({ username: value.toLowerCase() })
                    .then((userDoc) => {
                        if (!userDoc) return Promise.reject('That username is not valid!')
                    })
            })
    ], controller.postMessage)
    .post('/forum/vote', limiter, [
        body('messageId')
            .custom((value) => {
                return Message.findOne({ _id: value.toLowerCase() })
                    .then((message) => {
                        if (!message)
                            throw new Error('Invalid message!')
                    })
            }),
        body('direction')
            .custom(value => {
                const types = ['up', 'down']
                if (types.includes(value)) return true
                else throw new Error('Invalid vote direction!')
            })
    ], controller.postVote)

module.exports = router