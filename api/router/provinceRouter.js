const router = require('express').Router()
const {getAllProvince,getCity,getDesa,getKecamatan, getPostalCode} = require('../controller/provinceController')

router.get('/province',getAllProvince)
router.get('/city/:code', getCity)
router.get('/subdistrict/:city', getKecamatan)
router.get('/urban/:sub', getDesa)
router.get('/postalcode/', getPostalCode)

module.exports=router