const express = require('express')
require('dotenv').config()
const app = express()
const port =process.env.PORT || 7777
const db = require('./db/db')
const pdtroute = require('./routes/product')
const query = require('./routes/query')
const cors = require('cors')
const normal = require('./routes/normaluser')
const cart = require('./routes/cart')


app.use(express.json())
app.use(cors())
app.use('/product',pdtroute)
app.use('/query',query)
app.use('/normal',normal)
app.use('/cart',cart)
app.get('/',(req,res)=>{
    res.send('hello from server')
})

app.listen(port,()=>{
    console.log(`server running at ${port}`)
})