const router = require('express').Router()
const {addToCart, cartCount, getCart, deleteCart, updateQtyCart, checkout} = require('../controller/cartController')

router.post('/add', addToCart )
router.get('/count', cartCount)
router.get('/data', getCart)
router.delete('/delete/:id', deleteCart)
router.put('/edit/:id', updateQtyCart)
router.post('/checkout', checkout)
module.exports= router