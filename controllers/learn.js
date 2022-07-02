const { validationResult } = require("express-validator")

const languages = require('../data/available-ace-editor-languages')
const Message = require('../models/message')
const Project = require('../models/project')
const Vote = require('../models/vote')

exports.getLearnHome = (req, res, next) => {
    res.render('learn/learn-home', {
        pageTitle: 'Learning Homepage',
    })
}

exports.getCourse = (req, res, next) => {
    console.log(req.params.courseCode)
    res.render('learn/course', {
        pageTitle: 'Course',
    })
}

exports.getCourseArticle = (req, res, next) => {
    res.render('learn/course-article', {
        pageTitle: 'Course Article',
    })
}

exports.getNewPlayground = (req, res, next) => {
    res.render('learn/coding/new', {
        pageTitle: 'New Code Playground',
        languages: languages.supportedLanguages,
    })
}

exports.getUserProject = (req, res, next) => {
    Project.findById(req.params.projectId)
           .then((userProject) => {
                if (!userProject) {
                    req.flash('message', {
                        content: 'Can\t find that project!',
                        type: 'error'
                    })
                    return res.redirect('/')
                }

                Message.find({ connectedMessage: undefined })
                       .populate({ path: 'userId', select: ['firstName', 'lastName'] })
                       .sort({ "type": -1, "votes": -1, "sendDate": -1 })
                       .then((messages) => {
                            Vote.find({ userId: req.user._id })
                                .then((votes) => {
                                    let mappedMessages = messages.map((message) => {
                                        message = {
                                            ...message._doc,
                                            activatedUp: (votes.filter((vote) => {
                                                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'up')
                                            }).length > 0),
                                            activatedDown: (votes.filter((vote) => {
                                                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'down')
                                            }).length > 0)
                                        }
                                        return message
                                    })
                                    
                                    res.render('learn/coding/project', {
                                        pageTitle: userProject.title,
                                        projectCode: userProject.code,
                                        programmingLanguage: userProject.language,
                                        messages: mappedMessages
                                    })
                                })
                        })
            })
}

exports.getCodePlayground = (req, res, next) => {
    const requestedLanguage = req.params.type
    if (!languages.supportedLanguages.includes(requestedLanguage)) {
        req.flash('message', {
            content: 'That language is not supported',
            type: 'error'
        })
        return res.redirect('/learn')
    }

    res.render('learn/coding/playground', {
        pageTitle: 'Code Playground',
        programmingLanguage: requestedLanguage,
        projectCode: ''
    })
}

exports.postSaveProject = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: errors.array()[0].msg,
        })
    }
    if (!req.session.isLoggedIn) {
        return res.status(401).json({
            status: 'error',
            message: 'Please login to save your project',
        })
    }
    const projectCode = req.body['project-code']
    const projectLanguage = req.body['project-language']
    const projectTitle = req.body['project-title']
    if (projectCode && projectLanguage && projectTitle) {
        const newProject = new Project({
            userId: req.user._id,
            code: projectCode,
            language: projectLanguage,
            title: projectTitle,
            saveDate: new Date()
        })
        return newProject.save((err, savedProject) => {
            if (err) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Something is missing, please try again'
                })
            }

            return res.status(201).json({
                status: 'success',
                projectUrl: `${(process.env.NODE_ENV == 'development' ? 'http' : 'https')}://${req.headers.host}/code/project/${savedProject._id.toString()}`
            })
        })

    }
    else {
        return res.status(400).json({
            status: 'error',
            message: 'Something is missing, please try again'
        })
    }
}
