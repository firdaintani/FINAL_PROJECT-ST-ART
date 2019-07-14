const router = require('express').Router()
const {getUser, getProfilPicture, getDataProfile,updateProfileImage,getPassword,  updateProfileUser,changePassword,checkEmail} = require('./../controller/userController')
var upload = require('./../helpers/uploader_user')

router.get('/getuser', getUser)
router.get('/getpict', getProfilPicture)
router.get('/profile', getDataProfile)
router.put('/updatepicture',upload.single('imageprofile'),updateProfileImage )
router.get('/checkpassword', getPassword)
router.put('/updateprofile', updateProfileUser)
router.put('/changepassword', changePassword)
router.get('/checkemail', checkEmail)
module.exports=router