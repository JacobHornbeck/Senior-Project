const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.js")
const { body } = require("express-validator")
const User = require("../models/user")

router
    .get('/login', authController.getLogin)
    .get('/signup', authController.getSignUp)
    .get('/forgot-password', authController.getForgot)
    .get('/confirm-email/:confirm-code', authController.getEmailConfirmation)
    .post('/login', [
            body('email')
                .isEmail()
                .withMessage('Invalid Email Address')
                .normalizeEmail(),
            body('password')
                .isLength({min: 8})
                .withMessage('Passwords are at least 8 characters')
                .trim(),
        ], authController.postLogin)
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
                .custom((value) => {
                    return  User.findOne({username: value})
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
                .isLength({min: 8})
                .withMessage('Password must be at least 8 characters long!')
                .trim(),
            body('confirm-password')
                .trim()
                .custom((value, {req}) => {
                    if (value !== req.body.password)
                        throw new Error('Password don\'t match!')
                    
                    return true
                }) 
        ], authController.postSignUp)
    .get('/logout', authController.getLogout)

module.exports = router