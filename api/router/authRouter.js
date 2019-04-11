const router = require('express').Router()
const {userLogin,registerUser, verify, resendEmail} = require('./../controller').authController

router.get('/login', userLogin)
router.post('/register', registerUser)
router.put('/verify', verify)
router.put('/resend-email', resendEmail)
module.exports=router