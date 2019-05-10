var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var cors = require('cors')


app.use(cors())
app.use(bodyParser.json())
const port = 4000
const {userRouter, categoryRouter, productRouter, brandRouter, authRouter, cartRouter, transactionRouter, searchRouter, provinceRouter} = require('./router')

//HOME

app.use('/uploads',express.static('uploads'))

app.get('/', (req,res)=>{
    res.send('<h1>API START</h1>')
})
// app.options('*', cors())
app.use('/user', userRouter)
app.use('/category',categoryRouter)
app.use('/product', productRouter)
app.use('/brand', brandRouter)
app.use(authRouter)
app.use('/cart', cartRouter)
app.use('/transaction', transactionRouter)
app.use('/address', provinceRouter)

app.listen(port, ()=>console.log('aktif di port '+port))