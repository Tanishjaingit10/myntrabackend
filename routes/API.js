const express = require('express')
const router = express.Router()
const API = require('../Controllers/API')
const requireLogin = require('../middleware/requireLogin')

router.get('/stars',API.StarOfTheWeek)
router.get('/getUser',requireLogin,API.getUserData)
router.get('/getFeedbackCoins',requireLogin,API.addFeedbackCoins)

module.exports = router