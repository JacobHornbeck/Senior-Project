const { validationResult } = require("express-validator")

const languages = require('../data/available-ace-editor-languages')
const Project = require('../models/project')
const Course = require('../models/course')
const Article = require('../models/article')
const Tutorial = require('../models/tutorial')
const Reference = require('../models/reference')

const niceDate = (date) => {
    let d = new Date(date)
    return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`
}

exports.getLearnHome = (req, res, next) => {
    res.render('learn/learn-home', {
        pageTitle: 'Learning Homepage',
    })
}

exports.getCourse = async (req, res, next) => {
    const course = await Course.findById(req.params.courseId).populate('articles')
    course.articles = Array.from(course.articles).sort((a,b) => {
        return (a.order > b.order ? 1 : -1)
    })
    res.render('learn/course', {
        pageTitle: `Course - ${course.title}`,
        course: course
    })
}

exports.getCourseArticle = async (req, res, next) => {
    let article = await Article.findById(req.params.articleId).populate('courseFrom')
        article = await article.populate('courseFrom.articles')
    let articleArray = Array.from(article.courseFrom.articles)
    let previousArticle = ''
    let nextArticle = ''
    for (let i = 0; i < articleArray.length; i++) {
        if (i < articleArray.length - 1 && articleArray[i+1]._id.toString() == article._id.toString()) {
            previousArticle = articleArray[i]._id.toString()
        }
        if (i > 0 && articleArray[i-1]._id.toString() == article._id.toString()) {
            nextArticle = articleArray[i]._id.toString()
        }
    }
    res.render('learn/course-article', {
        pageTitle: article.title,
        article: article,
        previousArticle: previousArticle,
        nextArticle: nextArticle,
        messages: await article.getMessages(req.isLoggedIn ? req.user._id : ''),
        contentType: 'Article',
        articleId: article._id
    })
}

exports.getTutorial = async (req, res, next) => {
    let tutorial = await Tutorial.findById(req.params.tutorialId)
    
    res.render('learn/tutorial', {
        pageTitle: tutorial.title,
        tutorial: tutorial,
        messages: await tutorial.getMessages(req.isLoggedIn ? req.user._id : ''),
        contentType: 'Tutorial',
        tutorialId: tutorial._id
    })
}

exports.getReference = async (req, res, next) => {
    let reference = await Reference.findOne({ language: req.params.language.toLowerCase() })
    
    res.render('learn/reference', {
        pageTitle: reference.language.toUpperCase() + ' Reference',
        reference: reference,
        messages: await reference.getMessages(req.isLoggedIn ? req.user._id : ''),
        contentType: 'Reference',
        referenceId: reference._id
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
           .then(async (userProject) => {
                if (!userProject) {
                    req.flash('message', {
                        content: 'Can\t find that project!',
                        type: 'error'
                    })
                    return res.redirect('/')
                }
                const user = userProject.userId

                res.render('learn/coding/project', {
                    pageTitle: userProject.title,
                    programmingLanguage: userProject.language,
                    projectTitle: userProject.title,
                    projectCode: userProject.code,
                    projectId: userProject._id,
                    projectCreated: niceDate(userProject.saveDate),
                    projectUpdated: niceDate(userProject.editDate),
                    messages: await userProject.getMessages(req.user._id),
                    isOwn: (userProject.userId._id.toString() == req.user._id.toString()),
                    user: {
                        username: user.username,
                        displayName: user.displayName,
                        profileImg: user.profileAvatar
                    },
                    contentType: 'Project'
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
        projectTitle: 'New Project',
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
