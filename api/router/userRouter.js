const router = require('express').Router()
const {getUser} = require('./../controller').userController


router.get('/getuser', getUser)

module.exports=router