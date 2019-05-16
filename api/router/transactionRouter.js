const router = require('express').Router()
const {getTransactionByUsername,bank, getTransactionDetail,getAddressDetail, getTransaction, confirmPayment, getFinishedTransaction, deleteTransaction, countnewTransaction, getFinishedTransactionUser, uploadPayment, getOnProcessTransactionByUsername, getOnProcessTransaction, cancelPayment, getTotal,search} = require('../controller/transactionController')
var upload = require('./../helpers/uploader_payment')

router.get('/data', getTransactionByUsername)
router.get('/transaction-detail/:id', getTransactionDetail)
router.get('/all', getTransaction)
router.put('/confirm/:id', confirmPayment)
router.get('/finished', getFinishedTransaction )
router.delete('/delete/:id', deleteTransaction)
router.get('/count', countnewTransaction )
router.get('/user-finished', getFinishedTransactionUser)
router.put('/upload-payment/:id',upload.single('payment_picture'),uploadPayment )
router.get('/onprocess', getOnProcessTransactionByUsername)
router.get('/onprocessall', getOnProcessTransaction)
router.put('/cancel/:id', cancelPayment)
router.get('/total/:id', getTotal)
router.get('/bank', bank)
router.get('/address-detail/:id', getAddressDetail)
router.get('/search', search)

module.exports=router