const mongoose = require('mongoose')

const querySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    guest: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true

    },
    messages: {
        type: String,
        required: true
    }
    ,
    time: {
        type: String,
        required: true
    }



})

const Query = mongoose.model('Query', querySchema)
module.exports = Query