const express = require("express")
const router = express.Router()
const controller = require("../controllers/learn.js")

router
    .get('/learn', controller.getLearnHome)
    .get('/course/:courseCode', controller.getCourse)
    .get('/code/new', controller.getNewPlayground)
    .get('/code/new/:type', controller.getCodePlayground)
    .get('/code/project', controller.getUserProject)

module.exports = router