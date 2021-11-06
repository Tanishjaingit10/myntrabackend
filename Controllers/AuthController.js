const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, CLIENT_ID } = require('../keys')
const { OAuth2Client } = require('google-auth-library')
const { getReferral } = require('../Utils')

const client = new OAuth2Client( CLIENT_ID )

const signup = (req,res)=>{
    const {name,email,password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({"error":"please add all fields"})
    }
    User.findOne({email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with given email"})
        }
        bcrypt.hash(password,10)
        .then(hashedPassword=>{
            const referral = getReferral()
            const user = new User({
                email,
                password:hashedPassword,
                name,
                referral
            })
            user.save()
            .then(savedUser=>{
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                return res.json({token,user})
            })
            .catch(err=>console.log(err))
        })
    })
    .catch(err=>console.log(err))
}

const signin = (req,res)=>{
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
                return res.json({token,user:savedUser})
            }
            else{
                return res.status(422).json({error:"Wrong email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>console.log(err))
}

const googlesignup = (req,res)=>{
    const {token} = req.body;
    client.verifyIdToken({idToken:token, audience:CLIENT_ID})
    .then(response=>{
        const {email_verified, name, email, picture} = response.payload
        if(email_verified){
            User.findOne({email}).exec((err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"Something went wrong.."
                    })
                } else {
                    if(user){
                        res.status(422).json({error:"User already exists. Please login"})
                    } else {
                        let password = email+JWT_SECRET
                        bcrypt.hash(password,10)
                        .then(hashedPassword=>{
                            const referral = getReferral()
                            let newUser = new User({name, email, password:hashedPassword, referral, picture })
                            newUser.save((err,user)=>{
                                if(err){
                                    return res.status(400).json({error:"something went wrong"})
                                }
                                else{
                                    const token = jwt.sign({_id:user.id},JWT_SECRET)
                                    return res.json({token,user})
                                }
                            })
                        })
                    }
                }
            })
        }
        console.log(res.payload)
    })
}

const googlelogin = (req,res)=>{
    const {token} = req.body;
    client.verifyIdToken({idToken:token, audience:CLIENT_ID})
    .then(response=>{
        const {email_verified, email} = response.payload
        if(email_verified){
            User.findOne({email}).exec((err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"Something went wrong.."
                    })
                } else {
                    if(user){
                        const token = jwt.sign({_id:user.id},JWT_SECRET)
                        return res.json({token,user})
                    } else {
                        res.status(422).json({error:"User does not exist."})
                    }
                }
            })
        }
    })
}

module.exports = {
    signup, signin, googlelogin, googlesignup
}