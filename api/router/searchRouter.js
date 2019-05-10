const router = require('express').Router()
const {search } = require('../controller/searchController')

router.get('/search', search)

module.exports=router