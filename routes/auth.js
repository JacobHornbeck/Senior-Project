const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.js")
const { body } = require("express-validator/check")
const User = require("../models/user")

router
    .get('/login', authController.getLogin)
    .get('/signup', authController.getSignUp)
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
            body('email')
                .isEmail()
                .withMessage('Invalid Email Address')
                .custom((value, {req}) => {
                    return User.findOne({email: value})
                        .then((userDoc) => {
                            if (userDoc)
                                return Promise.reject('That email is already connected to an account <a href="/login">Login?</a>')
                        })
                }),
            body('password')
                .isLength({min: 8})
                .withMessage('Password must be at least 8 characters long!')
                .trim(),
            body('confirm')
                .trim()
                .custom((value, {req}) => {
                    if (value !== req.body.password)
                        throw new Error('Password don\'t match!')
                    
                    return true
                }) 
        ], authController.postSignUp)
    .post('/logout', authController.postLogout)

module.exports = router