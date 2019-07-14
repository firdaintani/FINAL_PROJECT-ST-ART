var userController = require('./userController')
var categoryController = require('./categoryController')
var productController = require('./productController')
var brandController = require('./brandController')
var authController = require('./authController')
const cartController = require('./cartController')
const transactionController = require('./transactionController')
const provinceController = require('./provinceController')
const reportController = require('./reportController')
const wishlistController = require('./wishlistController')

module.exports={
    userController,
    categoryController,
    productController,
    brandController,provinceController,
    authController, cartController, transactionController, reportController, wishlistController
}