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
    if (!req.params.projectId) {
        req.flash('message', {
            content: 'Missing project id',
            type: 'error'
        })
        return res.redirect('/')
    }

    Project.findById(req.params.projectId)
           .populate({ path: 'userId', select: ['displayName', 'username', 'profileAvatar']})
           .then((userProject) => {
                if (!userProject) {
                    req.flash('message', {
                        content: 'Can\t find that project!',
                        type: 'error'
                    })
                    return res.redirect('/')
                }

                Message.find({ connectedContent: userProject._id.toString(), connectedContentType: 'project' })
                       .populate({ path: 'userId', select: ['displayName'] })
                       .sort({ "type": -1, "votes": -1, "sendDate": -1 })
                       .then((messages) => {
                            Vote.find({ userId: req.user._id })
                                .then((votes) => {
                                    const gMessages = messages.filter(msg => !msg.connectedMessage)
                                    const otherMessages = messages.filter(msg => msg.connectedMessage)
                                    const mappedMessages = gMessages.map((message) => {
                                        let connectedComments = []
                                        for (let i = 0; i < otherMessages.length; i++) {
                                            if (otherMessages[i].connectedMessage.toString() == message._id.toString())
                                                connectedComments.push(otherMessages[i])
                                        }
                                        connectedComments.sort((a, b) => {
                                            return a.sendDate - b.sendDate
                                        })

                                        message = {
                                            ...message._doc,
                                            activatedUp: (votes.filter((vote) => {
                                                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'up')
                                            }).length > 0),
                                            activatedDown: (votes.filter((vote) => {
                                                return (vote.messageId.toString() == message._id.toString() && vote.direction == 'down')
                                            }).length > 0),
                                            comments: connectedComments
                                        }
                                        return message
                                    })

                                    const user = userProject.userId
                                    
                                    res.render('learn/coding/project', {
                                        pageTitle: userProject.title,
                                        projectCode: userProject.code,
                                        programmingLanguage: userProject.language,
                                        projectId: userProject._id,
                                        messages: mappedMessages,
                                        isOwn: (userProject.userId._id.toString() == req.user._id.toString()),
                                        user: {
                                            username: user.username,
                                            displayName: user.displayName,
                                            profileImg: user.profileAvatar
                                        },
                                        contentType: 'project'
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
        projectCode: '',
        projectId: '',
        isOwn: false
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
    const projectId = req.body['project-id']

    if (projectId.length > 0) {
        Project.findById(projectId)
               .then(userProject => {
                    if (!userProject) {
                        return res.status(400).json({
                            status: 'error',
                            message: 'Invalid project id'
                        })
                    }
                    if (userProject.userId.toString() !== req.user._id.toString()) {
                        const {_id, ...newProject} = userProject._doc;
                        newProject.userId = req.user._id;
                        newProject.saveDate = new Date();
                        const newUserProject = new Project(newProject)
                        newUserProject.save((err, savedProject) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({
                                    status: 'error',
                                    message: 'Something went wrong, please try again'
                                })
                            }
                
                            return res.status(201).json({
                                status: 'success',
                                projectUrl: `${(process.env.NODE_ENV == 'development' ? 'http' : 'https')}://${req.headers.host}/code/project/${savedProject._id.toString()}`
                            })
                        })
                    }
                    else {
                        userProject.code = projectCode;
                        userProject.title = projectTitle;
                        userProject.editDate = new Date();
                        userProject.save((err, doc) => {
                            if (err) {
                                console.log(err)
                                return res.status(400).json({
                                    status: 'error',
                                    message: 'Something went wrong, please try again'
                                })
                            }

                            return res.status(200).json({
                                status: 'saved',
                                message: 'Project saved successfully'
                            })
                        })
                    }
                })
    }
    else if (projectCode && projectLanguage && projectTitle) {
        const newProject = new Project({
            userId: req.user._id,
            code: projectCode,
            language: projectLanguage,
            title: projectTitle,
            saveDate: new Date()
        })
        return newProject.save((err, savedProject) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    status: 'error',
                    message: 'Something went wrong, please try again'
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
            message: 'Something went wrong, please try again'
        })
    }
}
