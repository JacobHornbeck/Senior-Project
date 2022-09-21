const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const User = require('../models/user')
const jwt = require("jsonwebtoken")

const availableCodeThemes = require('../data/codeThemes')
const availableEditorThemes = require('../data/editorThemes')

const {
    AccountCreated,
    AccountUpdated,
    EmailChanged,
    NewEmailConfirmation,
    RequestData
} = require('../data/nodeMailer')

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
                availableCodeThemes: availableCodeThemes,
                availableEditorThemes: availableEditorThemes,
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
            username: req.body.username
        })
        return res.redirect('/login')
    }

    User.findOne({ username: req.body.username.toLowerCase() })
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
                            AccountCreated(
                                user.email,
                                req.body.firstname + " " + req.body.lastname,
                                ((process.env.NODE_ENV === 'development') ?
                                    ('http://localhost:'+process.env.PORT) :
                                    ('https://genius-coding.herokuapp.com')) + '/confirm-email/' + emailConfirmationToken)
                                .catch(err => {
                                    console.log(err)
                                    req.flash('message', {
                                        content:  'Couldn\'t send confirmation email, please contact support',
                                        type:     'error'
                                    })
                                    res.redirect('/login')
                                })
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
                .catch(err => {
                    console.log(err)
                    req.flash('message', {
                        content:  'Something went wrong, please try again',
                        type:     'error'
                    })
                    res.redirect('/')
                })
        })
        .catch(err => {
            console.log(err)
            req.flash('message', {
                content:  'Something went wrong, please try again',
                type:     'error'
            })
            res.redirect('/')
        })
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
            
            AccountCreated(
                req.body.email,
                req.body.firstname + " " + req.body.lastname,
                ((process.env.NODE_ENV === 'development') ?
                    ('http://localhost:'+process.env.PORT) :
                    ('https://genius-coding.herokuapp.com')) + '/confirm-email/' + emailConfirmationToken)
                .catch(err => {
                    console.log(err)
                    req.flash('message', {
                        content:  'Couldn\'t send confirmation email, please contact support',
                        type:     'error'
                    })
                    res.redirect('/')
                })

            req.flash('message', {
                content:  'Account created! Please confirm your email address',
                type:     'success'
            })
            res.redirect('/')
        })
}

exports.postUpdateSettings = (req, res, next) => {
    const showLineNumbers = req.body.showLineNumbers ? req.body.showLineNumbers : false
    let previousEmail = ''
    let emailChanged = false

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
            if (user.username != req.body.username) {
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
            previousEmail = user.email

            // Update User Settings
            if (req.body.email != user.email) {
                user.email = req.body.email.toLowerCase()
                user.emailConfirmed = false
                req.session.destroy()
                emailChanged = true
                redirectTo = '/'
            }
            user.firstname = req.body.firstname
            user.lastname = req.body.lastname
            user.displayName = req.body.displayName
            user.bio = req.body.bio
            user.profileAvatar = req.body.profileAvatar
            user.profileBackground = req.body.profileBackground
            user.editorTheme = req.body.editorTheme
            user.editorLayout = req.body.editorLayout
            user.codeTheme = req.body.codeTheme
            user.showLineNumbers = showLineNumbers
            user.allowForumEmailNotifications = req.body['via-email']
            user.allowDesktopNotifications = req.body['via-browser']

            return user.save()
                .then(() => {
                    if (emailChanged) {
                        const emailConfirmationToken = jwt.sign(
                            { data: req.body.email },
                            'the most secret jwt security token secret',
                            { expiresIn: '12h' })
                        EmailChanged(
                            previousEmail,
                            user.firstName + ' ' + user.lastName,
                            req.body.email).catch(err => {
                                console.log(err)
                                req.flash('message', {
                                    content:  'Couldn\'t send confirmation email, please contact support',
                                    type:     'error'
                                })
                                res.redirect('/user/account-settings')
                            })
                        NewEmailConfirmation(
                            req.body.email,
                            user.firstName + ' ' + user.lastName,
                            ((process.env.NODE_ENV === 'development') ?
                                ('http://localhost:'+process.env.PORT) :
                                ('https://genius-coding.herokuapp.com')) + '/confirm-email/' + emailConfirmationToken)
                                .catch(err => {
                                    console.log(err)
                                    req.flash('message', {
                                        content:  'Couldn\'t send confirmation email, please contact support',
                                        type:     'error'
                                    })
                                    res.redirect('/user/account-settings')
                                })
                        req.flash('message', {
                            content:  'Email changed, please confirm new email',
                            type:     'success'
                        })
                    }
                    AccountUpdated(
                        previousEmail,
                        user.firstName + ' ' + user.lastName)
                        .catch(err => {
                            console.log(err)
                            req.flash('message', {
                                content:  'Couldn\'t send confirmation email, please contact support',
                                type:     'error'
                            })
                            res.redirect('/user/account-settings')
                        })

                    if (redirectTo.length > 0)
                        return res.redirect(redirectTo)
                    return res.redirect('/user/account-settings')
                })

        })
        .catch(err => {
            console.log(err)
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
                profileBackground: req.body.profileBackground,
                editorTheme: req.body.editorTheme,
                editorLayout: req.body.editorLayout,
                codeTheme: req.body.codeTheme,
                showLineNumbers: showLineNumbers
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
        .catch(err => {
            console.log(err)
            res.status(500).json({ "taken": true, "error": "Something went wrong" })
        })
}


exports.getRequestData = async (req, res, next) => {
    let user = await User.findById(req.user._id)
        user = user._doc
    delete user.password
    res.render('legal/request-my-data', {
        pageTitle: 'Request Your Data',
        user: user
    })
}

exports.postRequestData = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            let dataList = `
                <ul>
                    <li>FirstName: ${user.firstName}</li>
                    <li>LastName: ${user.lastName}</li>
                    <li>Email: ${user.email}</li>
                    <li>DisplayName: ${user.displayName}</li>
                    <li>Username: ${user.username}</li>
                    <li>Bio: ${user.bio}</li>
                </ul>
                <p>
                    The only other things we have stored that relate to you
                    are other site settings that you set.
                </p>`
            return RequestData(user.email, dataList)
        })
        .then(() => {
            req.flash('message', {
                content: 'You data has been sent via email, you should receive it soon. If not, check spam',
                type: 'success'
            })
            res.redirect('/request-my-data')
        })
        .catch((err) => {
            console.log(err)
            req.flash('message', {
                content:  'Something didn\'t work out, please try again',
                type:     'error'
            })
            res.redirect('/request-my-data')
        })
}

exports.markAsRead = (req, res, next) => {
    User.findById(req.user._id)
        .then(user => {
            user.markAllAsRead().then(() => res.json({ status: 'success' }))
        })
        .catch(err => {
            res.status(500).json({ status: 'error', message: err })
        })
}

exports.getNotifications = (req, res, next) => {
    User.findOne({ email: req.query.email, username: req.query.username })
        .then(user => {
            if (!user)
                return res.status(401).json({ err: 'Not a valid user!' })
            
            res.status(200).json({ status: 'success', notifications: user.notifications })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ err: err })
        })
}
