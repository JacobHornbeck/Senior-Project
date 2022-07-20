const { validationResult } = require("express-validator")
const Message = require("../models/message")
const Vote = require("../models/vote")
const User = require("../models/user")

const { ForumNotification } = require('../data/nodeMailer')

exports.postMessage = (req, res, next) => {
    const urlFrom = req.body.urlFrom
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("\nValidation errors: "+errors.array().map(err => `${err.param} (${err.value}): ${err.msg}`))
        req.flash('message', {
            content: errors.array()[0].msg,
            type: 'error'
        })
        if (req.body['connectedMessage'] == '') {
            req.flash('previous', {
                messageType: req.body['message-type'],
                messageContent: req.body['message-content'],
                urlFrom: urlFrom
            })
        }
        return res.redirect(urlFrom+'#messages')
    }

    User.findById(req.user._id)
        .then(async userDoc => {
            if (!userDoc) {
                req.flash('message', {
                    content: 'Cannot find that user!',
                    type: 'error'
                })
                return res.redirect(urlFrom+'#messages')
            }
            let message
            if (req.body['connectedMessage']) {
                message = new Message({
                    userId: userDoc._id,
                    sendDate: new Date(),
                    content: req.body['message-content'],
                    type: req.body['message-type'],
                    connectedContent: req.body['connectedContent'],
                    connectedContentType: req.body['connectedContentType'],
                    connectedMessage: req.body['connectedMessage']
                })
            }
            else {
                message = new Message({
                    userId: userDoc._id,
                    sendDate: new Date(),
                    content: req.body['message-content'],
                    type: req.body['message-type'],
                    connectedContent: req.body['connectedContent'],
                    connectedContentType: req.body['connectedContentType']
                })
            }

            
            let usersToNotify = await message.getUsersToNotify()
                usersToNotify.map(async (userId) => {
                    let user = await User.findById(userId)
                    if (user.allowForumEmailNotifications) {
                        ForumNotification(
                            user.email,
                            user.displayName,
                            userDoc.displayName,
                            urlFrom+'#messages',
                            message.content)
                    }
                    user.notifications.push({
                        from: userDoc.displayName,
                        profileImg: userDoc.profileAvatar,
                        content: message.content,
                        date: new Date(),
                        linkToMessage: urlFrom+'#messages'
                    })
                    user.save()
                })

            return message.save()
        })
        .then(() => {
            res.redirect(urlFrom+'#messages')
        })
        .catch(err => {
            console.log(err)
            console.log(err)
            req.flash('message', {
                content: 'Something went wrong, please try again later',
                type: 'error'
            })
            return res.redirect(urlFrom+'#messages')
        })
}

exports.postVote = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].msg)

    return Message
        .findById(req.body.messageId)
        .then((message) => {
            if (message.userId.toString() == req.user._id.toString())
                return res.status(400).json('You cannot vote on your own post!')
            else {
                return Vote
                    .findOne({ userId: req.user._id.toString(), messageId: message._id.toString() })
                    .then((vote) => {
                        if (vote) {
                            if (vote.direction == req.body.direction) {
                                if (vote.direction == 'up') message.votes--
                                else if (vote.direction == 'down') message.votes++
                                else return res.status(500).json('Something didn\'t work out, please try again')

                                message.save()
                                vote.remove()
                                return res.json({ message: 'removed', votes: message.votes })
                            }
                            else {
                                if (req.body.direction == 'up') message.votes+=2
                                else if (req.body.direction == 'down') message.votes-=2
                                message.save()
                                vote.direction = (vote.direction == 'up' ? 'down' : 'up')
                                vote.save()
                                return res.json({ message: 'changed', votes: message.votes })
                            }
                        }
                        else {
                            let messageVote = new Vote({
                                messageId: message._id,
                                userId: req.user._id,
                                direction: req.body.direction
                            })
                            if (req.body.direction == 'down') message.votes--
                            else if (req.body.direction == 'up') message.votes++
                            else return res.status(500).json('Something didn\'t work out, please try again')

                            message.save()
                            messageVote.save()
                            return res.json({ message: 'added', votes: message.votes })
                        }
                    })
                    .catch(e => {
                        console.log(e)
                        return res.status(500).json('Something didn\'t work out, please try again')
                    })
            }
        })
        .catch(e => {
            console.log(e)
            return res.status(500).json('Something didn\'t work out, please try again')
        })
}
