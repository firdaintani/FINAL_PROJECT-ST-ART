const router = require('express').Router()
const { getAllUser,getUser} = require('./../controller').userController


router.get('/alluser', getAllUser)
router.get('/getuser', getUser)

module.exports=router