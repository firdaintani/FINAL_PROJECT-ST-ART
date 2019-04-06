const router = require('express').Router()
const {userLogin, getAllUser,getUser,registeUser, sendEmail,verify,testencrypt} = require('./../controller').userController

router.get('/login', userLogin)
router.get('/alluser', getAllUser)
router.get('/getuser', getUser)
router.post('/register', registeUser)
router.get('/sendemail', sendEmail )
router.get('/verify', verify)
router.get('/testencrypt',testencrypt)
module.exports=router