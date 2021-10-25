const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./keys')
// 064NsPjMmbIkDuNj

mongoose.connect(MONGOURI)

mongoose.connection.on('connected',() => {
    console.log('connected to mongo')
})
mongoose.connection.on('error',(err) => {
    console.log('connection error',err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

