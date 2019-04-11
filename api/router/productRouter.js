const router = require('express').Router()
const {getAllProduct, addProduct, deleteProduct}  = require('./../controller').productController
var upload = require('./../helpers/uploader')

router.get('/all', getAllProduct)
router.post('/add',upload.single('product_image'),addProduct )
router.delete('/delete/:id', deleteProduct)

module.exports=router