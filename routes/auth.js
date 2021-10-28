const express = require('express')
const router = express.Router()
const Auth = require('../Controllers/AuthController')

router.post('/signup',Auth.signup)
router.post('/signin',Auth.signin)
router.post('/googlelogin',Auth.googlelogin)
router.post('/googlesignup',Auth.googlesignup)

module.exports = router