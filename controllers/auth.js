const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const User = require('../models/user')
const jwt = require("jsonwebtoken")

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.mailerAPI
    }
}))

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
        isAuthenticated: false
    })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.getForgot = (req, res, next) => {
    res.render('auth/forgot-password', {
        pageTitle: 'Forgot Password',
        isAuthenticated: false
    })
}

exports.getEmailConfirmation = (req, res, next) => {
    const token = req.params.confirmation
    jwt.verify(token, 'the most secret jwt security token secret', (err, decoded) => {
        if (err) {
            req.flash('message', {
                content:  err.message,
                type:     'error'
            })
            return res.redirect('/')
        }
        User.findOne({ email: decoded.data })
            .then(user => {
                req.flash('message', {
                    content:  'Your email has been confirmed! Please login',
                    type:     'success'
                })
                user.emailConfirmed = true
                user.save()
                res.redirect('/login')
            })
    })
}

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('message', {
            content:  errors.array()[0].msg,
            type:     'error'
        })
        req.flash('previous', {
            email: req.body.email
        })
        return res.redirect('/login')
    }

    User.findOne({email: req.body.email.toLowerCase()})
        .then(user => {
            if (!user) {
                req.flash('message', {
                    content:  'Invalid credentials, please try again',
                    type:     'error'
                })
                return res.redirect('/login')
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((passwordsMatch) => {
                    if (passwordsMatch) {
                        if (!user.emailConfirmed) {
                            req.flash('message', {
                                content:  'Please confirm your email',
                                type:     'error'
                            })
                            return res.redirect('/login')
                        }
                        req.session.isLoggedIn = true
                        req.session.user = user
                        return req.session.save(err => {
                            if (err) console.log(err)
                            res.redirect('/')
                        })
                    }
                    req.flash('message', {
                        content:  'Invalid credentials, please try again',
                        type:     'error'
                    })
                    res.redirect('/login')
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

exports.postSignUp = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('message', {
            content:  errors.array()[0].msg,
            type:     'error'
        })
        req.flash('previous', {
            email:      req.body.email,
            username:   req.body.username,
            firstname:  req.body.firstname,
            lastname:   req.body.lastname,
        })
        return res.redirect('/signup')
    }

    bcrypt
        .hash(req.body.password, 12)
        .then(hashedPassword => {
            const user = new User({
                username:   req.body.username.toLowerCase(),
                firstName:  req.body.firstname,
                lastName:   req.body.lastname,
                email:      req.body.email.toLowerCase(),
                password:   hashedPassword,
            })
            return user.save()
        })
        .then(() => {
            const emailConfirmationToken = jwt.sign(
                { data: req.body.email },
                'the most secret jwt security token secret',
                { expiresIn: '12h' })
            transporter.sendMail({
                to: req.body.email,
                from: 'Account Management<Jacob.Hornbeck@outlook.com>',
                subject: 'Account Creation Successful!',
                html: `<section>
                    <h1 style="text-align: center;">Successful!</h1>
                    <p style="text-align: center;">${req.body.firstname} ${req.body.lastname}, you successfully signed up for an account!</p>
                    <p style="text-align: center;">You must <a href="${(process.env.NODE_ENV === 'development') ? ('http://localhost:'+process.env.PORT) : ('https://genius-coding.herokuapp.com')}/confirm-email/${emailConfirmationToken}">confirm your email</a> before you can login.<br>
                                                   This link will expire in 12 hours.</p>
                </section>`
            })
            .catch(err => console.log(err))

            req.flash('message', {
                content:  'Account created! Please confirm your email address',
                type:     'success'
            })
            res.redirect('/')
        })
}

exports.usernameTaken = (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() })
        .then(user => {
            if (user) return res.json({ "taken": true })
            else return res.json({ "taken": false })
        })
        .catch(err => console.log(err))
}
