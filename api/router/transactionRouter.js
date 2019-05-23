const router = require('express').Router()
const {bank, getTransactionDetail,getAddressPaymentDetail,wrongPicture, getTransaction, confirmPayment, uploadPayment,  cancelPayment, getTotal,search} = require('../controller/transactionController')
var upload = require('./../helpers/uploader_payment')

router.get('/transaction-detail/:id', getTransactionDetail)
router.get('/all', getTransaction)
router.put('/confirm/:id', confirmPayment)
router.put('/upload-payment/:id',upload.single('payment_picture'),uploadPayment )
router.get('/cancel/:id', cancelPayment)
router.get('/total/:id', getTotal)
router.get('/bank', bank)
router.get('/address-detail/:id', getAddressPaymentDetail)
router.get('/search', search)
router.put('/wrongpicture/:id', wrongPicture)

module.exports=router