const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')


router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({"error":"please add all fields"})
    }
    User.findOne({email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({"error":"user already exists with given email"})
        }
        bcrypt.hash(password,10)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({message:"saved user successfully"})
            })
            .catch(err=>console.log(err))
        })
    })
    .catch(err=>console.log(err))
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add all fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Wrong email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
            }
            else{
                return res.status(422).json({error:"Wrong email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/googlelogin',(req,res)=>{
    console.log("reached")
    const token = req.body;
    console.log(token)
    return res.send("kkk")
})

module.exports = router