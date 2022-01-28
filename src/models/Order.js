const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    customerDetail:{type:Object, required:true},
    customerOrder:{type:Array, required:true},
    totolPrice:{type:Number, required:true},
    paymentstatus:{type:Boolean, required:true},
    confirmOrder:{type:Boolean, required:true,default:true},
    processing:{type:Boolean, required:true,default:false},
    dispatch:{type:Boolean, required:true,default:false},
    delivered:{type:Boolean, required:true,default:false},
    ordertime:{type:String},
    deliverytime:{type:String}


})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order