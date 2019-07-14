const router = require('express').Router()
const {getAllProduct, addProduct, deleteProduct,getProductList ,updateProduct,newArrival, getProductDetail, search, productDiscount, getPaging}  = require('./../controller').productController
var upload = require('./../helpers/uploader')

router.get('/all/', getAllProduct)
router.get('/product-list', getProductList)
router.post('/add',upload.single('product_image'),addProduct )
router.delete('/delete/:id', deleteProduct)
router.put('/update/:id', upload.single('updateimage'),updateProduct )
router.get('/product-detail/:id',getProductDetail )
router.get('/search', search)
router.get('/discount', productDiscount)
router.get('/new', newArrival)
router.get('/paging/:page', getPaging)
module.exports=router