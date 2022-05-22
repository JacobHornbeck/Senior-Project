const express = require("express")
const router = express.Router()
const controller = require("../controllers/learn.js")

router
    .get('/learn', controller.getLearnHome)
    .get('/course/:courseCode', controller.getCourse)

module.exports = router