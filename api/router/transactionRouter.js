const router = require('express').Router()
const {getTransactionByUsername, getTransactionDetail, getTransaction, editStatus, getFinishedTransaction, deleteTransaction} = require('../controller/transactionController')

router.get('/data', getTransactionByUsername)
router.get('/transaction-detail/:id', getTransactionDetail)
router.get('/all', getTransaction)
router.put('/update/:id', editStatus)
router.get('/finished', getFinishedTransaction )
router.delete('/delete/:id', deleteTransaction)


module.exports=router