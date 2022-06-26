const express = require("express")
const router = express.Router()
const controller = require("../controllers/learn.js")
const isAuth = require('../middleware/is-auth')

router
    .get('/learn', controller.getLearnHome)
    .get('/course/:courseCode', controller.getCourse)
    .get('/code/new', controller.getNewPlayground)
    .get('/code/new/:type', controller.getCodePlayground)
    .get('/code/project/:projectId', controller.getUserProject)
    .post('/user/save/project', isAuth, controller.postSaveProject)

module.exports = router