const express = require("express")
const route = express.Router()
const auth = require('../middleware/auth')
const {addCart,getCart,deleteById,successDelete}  =require('../controller/cart')

route.post('/post',auth,addCart)
route.get('/get',auth,getCart)
route.delete('/del/:id',auth,deleteById)
route.delete('/delete',auth,successDelete)


module.exports = route