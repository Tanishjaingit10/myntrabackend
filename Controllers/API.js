const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')

const StarOfTheWeek = (req,res) => {
    User.find().sort({coins:-1})
    .then(resp=>{return res.json(resp.slice(0,3))})
    .catch(err => {return res.status(500).json(err)})
}

const getUserData = (req,res) => {
    return res.json(req.user)
}

const addFeedbackCoins = (req,res) => {
    let user = req.user
    user.coins += 10
    user.save()
    return res.json({"message":"Thank you for your feedback. 10 coins added to your account!"})
}

module.exports = {
    StarOfTheWeek,getUserData,addFeedbackCoins
}