const express = require("express")
const route = express.Router()
const {addData,getData,deleteData,getDataById,editProduct,addTopProduct,getTopProduct,deleteTopProduct}= require('../controller/product')

route.post('/post',addData)
route.get('/get',getData)
route.delete('/delete/:id',deleteData)
route.get('/getitem/:id',getDataById)
route.patch('/edit/:id',editProduct)
route.post('/tproduct',addTopProduct)
route.get('/tproduct',getTopProduct)
// route.delete('/tproduct/:id',deleteTopProduct)

module.exports = route