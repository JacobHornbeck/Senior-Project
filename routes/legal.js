const express = require("express")
const router = express.Router()
const legalController = require("../controllers/legal.js")

router
    .get('/privacy-policy', legalController.getPrivacyPolicy)
    .get('/credits', legalController.getCredits)

module.exports = router