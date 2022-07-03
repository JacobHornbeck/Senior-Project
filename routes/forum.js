const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const rateLimit = require("express-rate-limit")

const controller = require("../controllers/forum.js")
const Message = require("../models/message")
const User = require("../models/user")
const Project = require("../models/project")
// const Article = require("../models/article")
// const Tutorial = require("../models/tutorial")
// const Reference = require("../models/reference")

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
        body('connectedContentType')
            .isString()
            .custom(value => {
                const types = [
                    'project',
                    'article',
                    'tutorial',
                    'reference'
                ]
                if (types.includes(value))
                    return true
                else
                    throw new Error('Invalid content type!')
            }),
        body('connectedContent')
            .isString()
            .custom((value, {req}) => {
                switch (req.body.connectedContentType) {
                    case "project":
                        Project.findById(value)
                               .then(project => {
                                    if (!project) return Promise.reject('Project doesn\'t exist')
                                })
                    break;
                    /* case "article":
                        Article.findById(value)
                               .then(article => {
                                    if (!article) return Promise.reject('Article doesn\'t exist')
                                })
                    break;
                    case "tutorial":
                        Tutorial.findById(value)
                               .then(tutorial => {
                                    if (!tutorial) return Promise.reject('Tutorial doesn\'t exist')
                                })
                    break;
                    case "reference":
                        Reference.findById(value)
                               .then(reference => {
                                    if (!reference) return Promise.reject('Reference doesn\'t exist')
                                })
                    break; */
                }
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