const router = require('express').Router()
const {getAllProduct, addProduct, deleteProduct,getProductList ,updateProduct, getProductDetail}  = require('./../controller').productController
var upload = require('./../helpers/uploader')

router.get('/all', getAllProduct)
router.post('/add',upload.single('product_image'),addProduct )
router.delete('/delete/:id', deleteProduct)
router.put('/update/:id', upload.single('updateimage'),updateProduct )
router.get('/product-list', getProductList)
router.get('/product-detail/:id',getProductDetail )
module.exports=router