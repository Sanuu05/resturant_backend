const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const topSchema = mongoose.Schema({
        top:{
                type:Object,
                required:true
        }
        ,by: {
                type: ObjectId,
                ref: "Product"
        }


})

const Tproduct = mongoose.model('Tproduct', topSchema)
module.exports = Tproduct