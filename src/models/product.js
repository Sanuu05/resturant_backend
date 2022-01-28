const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    des:{
        type:String,
        required:true
    },
    productimg:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    cath:{
        type:String,
        required:true
    },
    nveg:{
        type:Boolean,
        default:true
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports= Product