const router = require('express').Router()
const {getAllCategory, editCategory,addCategory,deleteCategory} = require('./../controller').categoryController
const upload = require('../helpers/uploader_cat')

router.get('/all',getAllCategory)
router.put('/update/:id',upload.single('newImage'), editCategory)
router.post('/add',upload.single('category_image'), addCategory)
router.delete('/delete/:id',deleteCategory)
module.exports=router