const uniqueRandom = require("unique-random-string")

const getReferral = (()=>{
    let ref = uniqueRandom(6,(err,randomString)=>{
        return randomString
    })
    return ref.toUpperCase()
})

module.exports = {
    getReferral
}