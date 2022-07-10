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
        isAuthenticated: false,
        queryParams: req.query.redirectTo ? "?redirectTo=" + encodeURIComponent(req.query.redirectTo) : "",
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

exports.getAccountSettings = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            if (!user) {
                req.flash('message', {
                    content:  'Finding user failed, make sure you are logged in',
                    type:     'error'
                })
                return res.redirect('/')
            }
            let {password, ...loadedUser} = user._doc

            res.render('auth/account-settings', {
                pageTitle: 'Account Settings',
                user: loadedUser,
                domainUrl: (req.hostname == 'localhost' ? 'http' : 'https') + '://' + req.headers.host
            })
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
                        let publicUser = JSON.parse(JSON.stringify(user))
                        delete publicUser.password
                        req.session.user = publicUser
                        return req.session.save(err => {
                            if (err) console.log(err)
                            res.redirect(req.query.redirectTo ? req.query.redirectTo : '/')
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

exports.postUpdateSettings = (req, res, next) => {
    const showLineNumbers = req.body.showLineNumbers ? req.body.showLineNumbers : false

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('message', {
            content:  errors.array()[0].msg,
            type:     'error'
        })
        req.flash('previous', {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            displayName: req.body.displayName,
            bio: req.body.bio,
            profileAvatar: req.body.profileAvatar,
            profileBackground: req.body.profileBackground,
            editorTheme: req.body.editorTheme,
            editorLayout: req.body.editorLayout,
            codeTheme: req.body.codeTheme,
            showLineNumbers: showLineNumbers
        })
        return res.redirect('/user/account-settings')
    }

    // console.log(req.body)

    // return res.redirect('/user/account-settings')
    User.findById(req.user._id)
        .then(user => {
            let redirectTo = ""
            if (!user) {
                req.flash('message', {
                    content:  'Finding user failed, make sure you are logged in',
                    type:     'error'
                })
                return res.redirect('/')
            }
            let {password, ...loadedUser} = user._doc
            if (loadedUser.username != req.body.username) {
                req.flash('message', {
                    content:  'You cannot change your username!',
                    type:     'error'
                })
                req.flash('previous', {
                    email: req.body.email,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    displayName: req.body.displayName,
                    bio: req.body.bio,
                    profileAvatar: req.body.profileAvatar,
                    profileBackground: req.body.profileBackground,
                    editorTheme: req.body.editorTheme,
                    editorLayout: req.body.editorLayout,
                    codeTheme: req.body.codeTheme,
                    showLineNumbers: showLineNumbers
                })
                return res.redirect('/user/account-settings')
            }

            // Update User Settings
            if (req.body.email != loadedUser.email) {
                loadedUser.email = req.body.email
                loadedUser.emailConfirmed = false
                req.session.destroy()
                redirectTo = '/'
            }
            loadedUser.firstname = req.body.firstname
            loadedUser.lastname = req.body.lastname
            loadedUser.displayName = req.body.displayName
            loadedUser.bio = req.body.bio
            loadedUser.profileAvatar = req.body.profileAvatar
            loadedUser.profileBackground = req.body.profileBackground
            loadedUser.editorTheme = req.body.editorTheme
            loadedUser.editorLayout = req.body.editorLayout
            loadedUser.codeTheme = req.body.codeTheme
            loadedUser.showLineNumbers = showLineNumbers

            if (redirectTo.length > 0)
                return res.redirect(redirectTo)
            return res.redirect('/user/account-settings')
        })
        .catch(err => {
            req.flash('message', {
                content:  'Something didn\'t work out, please try again',
                type:     'error'
            })
            req.flash('previous', {
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                displayName: req.body.displayName,
                bio: req.body.bio,
                profileAvatar: req.body.profileAvatar,
                profileBackground: req.body.profileBackground
            })
            return res.redirect('/user/account-settings')
        })
}

exports.usernameTaken = (req, res, next) => {
    User.findOne({ username: req.query.username.toLowerCase() })
        .then(user => {
            if (user) return res.json({ "taken": true })
            else return res.json({ "taken": false })
        })
        .catch(err => console.log(err))
}
