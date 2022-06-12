const languages = require('../data/available-ace-editor-languages')
const Message = require('../models/message')

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

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
    Message.find({ type: "comment" })
        .populate({ path: 'userId', select: ['firstName', 'lastName'] })
        .then((messages) => {
            /* messages = messages.map((message) => {
                let dt = message.sendDate
                message.datePosted = `${months[dt.getMonth()]} ${dt.getDate()} ${dt.getFullYear()}`
                return message
            }) */
            
            res.render('learn/coding/project', {
                pageTitle: 'Project',
                projectCode: `let tempVar = 'This is a test';

function something() {
    console.log("Hello World!");
    document.body.innerHTML = tempVar;
}`,
                programmingLanguage: 'JavaScript',
                messages: messages
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
