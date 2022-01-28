const express = require('express')
const route = express.Router()
const Query = require('../models/query')

route.post('/post', async(req,res)=>{
    try {
        const data = new Query(req.body)
        const savedata = await data.save()
        res.json(savedata)
    } catch (error) {
        console.log(error)
    }
})
route.get('/get', async(req,res)=>{
    try {
        const data = await Query.find()
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})
route.delete('/delete/:id', async(req,res)=>{
    try {
        const del = await Query.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log(error)
    }
})




module.exports=route