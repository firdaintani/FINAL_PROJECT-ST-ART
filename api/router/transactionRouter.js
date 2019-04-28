const router = require('express').Router()
const {getTransactionByUsername, getTransactionDetail, getTransaction, editStatus, getFinishedTransaction, deleteTransaction, countnewTransaction, getFinishedTransactionUser, uploadPayment, getOnProcessTransactionByUsername, getOnProcessTransaction} = require('../controller/transactionController')
var upload = require('./../helpers/uploader')

router.get('/data', getTransactionByUsername)
router.get('/transaction-detail/:id', getTransactionDetail)
router.get('/all', getTransaction)
router.put('/confirm/:id', editStatus)
router.get('/finished', getFinishedTransaction )
router.delete('/delete/:id', deleteTransaction)
router.get('/count', countnewTransaction )
router.get('/user-finished', getFinishedTransactionUser)
router.put('/upload-payment/:id',upload.single('payment_picture'),uploadPayment )
router.get('/onprocess', getOnProcessTransactionByUsername)
router.get('/onprocessall', getOnProcessTransaction)


module.exports=router