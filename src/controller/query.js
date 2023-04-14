const Query = require('../models/query')


//TODO: Add Query
exports.addQuery= async(req,res)=>{
    try {
        const data = new Query(req.body)
        const savedata = await data.save()
        res.json(savedata)
    } catch (error) {
        console.log(error)
    }
}

//TODO: Get Query
exports.getQuery= async(req,res)=>{
    try {
        const data = await Query.find()
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

//TODO: Delete Query
exports.deleteQuery= async(req,res)=>{
    try {
        const del = await Query.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log(error)
    }
}


