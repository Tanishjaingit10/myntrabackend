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

module.exports = {
    StarOfTheWeek,getUserData
}