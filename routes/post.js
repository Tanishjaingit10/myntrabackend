const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')
const Post = mongoose.model("Post")

router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>res.json(err))
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(myPost=>res.json({myPost}))
    .catch(err=>res.json(err))
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body
    if(!title || !body){
        return res.status(422).json({error:"Please add all fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save()
    .then(result=>{
        return res.json({post:result})
    })
    .catch(err=>res.status(422).json(err))
})

module.exports = router