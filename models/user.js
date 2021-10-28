const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    coins:{
        type:Number,
        required:true,
        default:0
    },
    referral:{
        type:String,
        required:true
    },
    referralUsed:{
        type:Boolean,
        default:false
    },
    picture:{
        type:String,
        default:""
    }
})

mongoose.model('User',userSchema)