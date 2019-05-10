const router = require('express').Router()
const {getTransactionByUsername, getTransactionDetail, getTransaction, confirmPayment, getFinishedTransaction, deleteTransaction, countnewTransaction, getFinishedTransactionUser, uploadPayment, getOnProcessTransactionByUsername, getOnProcessTransaction, cancelPayment} = require('../controller/transactionController')
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


module.exports=router