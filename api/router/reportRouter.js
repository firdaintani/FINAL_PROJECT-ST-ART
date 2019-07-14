const router = require('express').Router()
const {getMostBuyItem, MostBuyUser, SeringBuy} = require('../controller/reportController')

router.get('/mostbuyitem', getMostBuyItem)
router.get('/mostbuyuser', MostBuyUser)
router.get('/seringbuy', SeringBuy)

module.exports= router