const { validationResult } = require("express-validator")
const Message = require("../models/message")
const User = require("../models/user")

exports.postMessage = (req, res, next) => {
    const urlFrom = req.body.urlFrom
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('message', {
            content: errors.array()[0].msg,
            type: 'error'
        })
        req.flash('previous', {
            messageType: req.body['message-type'],
            messageContent: req.body['message-content'],
            urlFrom: urlFrom
        })
        return res.redirect(urlFrom)
    }

    User.findOne({
            username: req.body.username.toLowerCase()
        })
        .then(userDoc => {
            if (!userDoc) {
                req.flash('message', {
                    content: 'User doesn\'t exist with that username',
                    type: 'error'
                })
                return res.redirect(urlFrom)
            }

            Message.findOne({})
            const message = new Message({
                userId: userDoc._id,
                sendDate: new Date(),
                content: req.body['message-content'],
                type: req.body['message-type'],
                // connectedContent: ,
            })
            return message.save()
        })
        .then(() => {
            res.redirect(urlFrom)
        })
        .catch(err => console.log(err))
}