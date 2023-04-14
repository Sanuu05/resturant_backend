const express = require("express")
const route = express.Router()
const {addQuery,getQuery,deleteQuery} = require('../controller/query')
route.post('/post',addQuery)
route.get('/get',getQuery)
route.delete('/delete/:id',deleteQuery)

module.exports= route