const router = require('express').Router()
const {getAllBrand, editBrand,addBrand,deleteBrand, selectBrandByCat} = require('../controller').brandController

router.get('/all',getAllBrand)
router.put('/update/:id', editBrand)
router.post('/add', addBrand)
router.delete('/delete/:id',deleteBrand)
router.get('/selectbrand', selectBrandByCat)

module.exports=router