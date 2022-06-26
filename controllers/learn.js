const languages = require('../data/available-ace-editor-languages')
const Message = require('../models/message')
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
                            pageTitle: 'Project',
                            projectCode: `let tempVar = 'This is a test';
    
function something() {
    console.log("Hello World!");
    document.body.innerHTML = tempVar;
}`,
                            programmingLanguage: 'JavaScript',
                            messages: mappedMessages
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
        programmingLanguage: requestedLanguage
    })
}

exports.postSaveProject = (req, res, next) => {
    
}
