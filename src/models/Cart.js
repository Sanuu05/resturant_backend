const mongoose = require('mongoose')
const {ObjectId} =  mongoose.Types

const cartSchema = mongoose.Schema({
    cart:[
        {
            cartitem:{ type: ObjectId , ref:"productdetail"},
            pimg:{type:String, required:true},
            cath:{type:String, required:true},
            pname:{type:String, required:true},
            stock:{type:String, required:true},
            price:{type: Number, required:true}, 
            qyt:{type:Number, default:1 }
        }

    ]
    ,
    by:{
        type:ObjectId,
        ref:"Normal"

    }
})

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart