const express = require("express")
const route = express.Router()
const auth = require('../middleware/auth')
const {signUp,Login,getUserData,webOrder,webSuccessOrder,mobileOrder,mobileSuccessOrder,ordetItem,userOrderedItem,trackOrder,editOrder,deleteOrder} = require('../controller/normaluser')

route.post('/signup',signUp)
route.post('/login',Login)
route.get('/getuser',auth,getUserData)
route.post('/orders',webOrder)
route.post('sorder',mobileOrder)
route.post('/success',auth,webSuccessOrder)
route.post('/successnew',auth,mobileSuccessOrder)
route.get('/orderitem',auth,userOrderedItem)
route.get('/order',ordetItem)
route.get('/trackorder/:id',trackOrder)
route.patch('/orderedit/:id',editOrder)
route.delete('/order/:id',deleteOrder)





module.exports= route