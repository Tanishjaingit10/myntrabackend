const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.json("Backend is Active")
})

module.exports = router
