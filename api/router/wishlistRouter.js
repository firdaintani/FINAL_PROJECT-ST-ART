const router = require('express').Router()
const {deleteWishlist, addWishlist,getWishlist, countWishlist,search,getProduct} = require('./../controller').wishlistController


router.get('/all/:username', getWishlist)
router.post('/add', addWishlist)
router.delete('/delete/:id', deleteWishlist)
router.get('/count/:username', countWishlist)
router.get('/search', search)
router.get('/getproduct',getProduct)

module.exports=router