exports.getLearnHome = (req, res, next) => {
    res.render('learn/learn-home', {
        pageTitle: 'Learning Homepage',
    })
}

exports.getCourse = (req, res, next) => {
    res.render('learn/course', {
        pageTitle: 'Course',
    })
}

exports.getCourseArticle = (req, res, next) => {
    res.render('learn/course-article', {
        pageTitle: 'Course Article',
    })
}
