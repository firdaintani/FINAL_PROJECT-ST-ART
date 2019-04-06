const router = require('express').Router()
const {getAllCategory, editCategory,addCategory,deleteCategory} = require('./../controller').categoryController

router.get('/all',getAllCategory)
router.put('/update/:id', editCategory)
router.post('/add', addCategory)
router.delete('/delete/:id',deleteCategory)
module.exports=router