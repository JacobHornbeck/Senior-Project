const express = require("express")
const router = express.Router()
const { body } = require("express-validator")

const controller = require("../controllers/learn.js")
const availableLanguages = require('../data/available-ace-editor-languages').supportedLanguages

router
    .get('/learn', controller.getLearnHome)
    .get('/course/:courseCode', controller.getCourse)
    .get('/code/new', controller.getNewPlayground)
    .get('/code/new/:type', controller.getCodePlayground)
    .get('/code/project/:projectId', controller.getUserProject)
    .post('/user/save/project', [
        body('project-code')
            .isString()
            .isLength({ min: 5 })
            .withMessage("Project code must be a string and at least 5 characters"),
        body('project-language')
            .isString()
            .trim()
            .custom((val) => {
                return availableLanguages.includes(val)
            })
    ], controller.postSaveProject)

module.exports = router