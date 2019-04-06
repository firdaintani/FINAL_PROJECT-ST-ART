const router = require('express').Router()
const {getAllProduct}  = require('./../controller').productController

router.get('/all', getAllProduct)

module.exports=router