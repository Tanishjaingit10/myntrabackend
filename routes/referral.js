const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")


router.post('/referral',requireLogin,(req,res)=>{
    const { referral } = req.body
    if( !referral ){
        return res.status(404).json({error:"referral code not provided"})
    }
    let user1=req.user
    User.findOne({referral})
    .then(user2=>{
        user1.coins+=200
        user2.coins+=200
        user1.referralUsed = true
        user1.save()
        user2.save()
        return res.json({message:`You and your friend ${user2.name} got 200 coins each!`})
    })
    .catch(err=> {return res.status(422).json({error:"Something went wrong."})})
})

module.exports = router