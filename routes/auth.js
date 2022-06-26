const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const controller = require("../controllers/auth.js")
const User = require("../models/user")

router
    .get('/login', controller.getLogin)
    .get('/signup', controller.getSignUp)
    .get('/logout', controller.getLogout)
    .get('/forgot-password', controller.getForgot)
    .get('/confirm-email/:confirmation', controller.getEmailConfirmation)
    .get('/request-my-data', (req, res, next) => {
        // Do stuff here
    })
    .post('/login', [
            body('email')
                .isEmail()
                .withMessage('Invalid Email Address')
                .normalizeEmail(),
            body('password')
                .isLength({min: 8})
                .withMessage('Passwords must be at least 8 characters')
                .trim(),
        ], controller.postLogin)
    .post('/signup', [
            body('email')
                .isEmail()
                .withMessage('Invalid Email Address')
                .custom((value) => {
                    return  User.findOne({email: value})
                                .then((userDoc) => {
                                    if (userDoc)
                                        return Promise.reject('That email is already connected to an account <a href="/login">Login?</a>')
                                })
                }),
            body('username')
                .isAlphanumeric()
                .withMessage('Usernames can only be letters and numbers!')
                .isLength({min: 4})
                .withMessage('Username must be 4 characters or more')
                .custom((value) => {
                    return  User.findOne({username: value.toLowerCase()})
                                .then((userDoc) => {
                                    if (userDoc)
                                        return Promise.reject('That username is already used, please choose another one.')
                                })
                }),
            body('firstname')
                .isAlpha()
                .withMessage('Firstname can only contain letters')
                .isLength({min: 2})
                .withMessage('Firstname must be at least 2 letters'),
            body('lastname')
                .isAlpha()
                .withMessage('Lastname can only contain letters')
                .isLength({min: 2})
                .withMessage('Lastname must be at least 2 letters'),
            body('password')
                .isLength({min: 8, max: 100})
                .withMessage('Password must be between 8 and 100 characters long!')
                .trim(),
            body('confirm-password')
                .trim()
                .custom((value, {req}) => {
                    if (value !== req.body.password)
                        throw new Error('Password don\'t match!')
                    
                    return true
                }) 
        ], controller.postSignUp)
    .get('/username-validity', controller.usernameTaken)
    .post('/request-my-data', (req, res, next) => {
        // Do stuff here
    })

module.exports = router