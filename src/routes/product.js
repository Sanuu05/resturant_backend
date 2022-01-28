const express = require('express')
const route = express.Router()
const Product = require('../models/product')
const Tproduct = require('./../models/TopPro') 


route.get('/', (req,res)=>{
    res.send('hello from product page')
})
route.post('/post', async(req,res)=>{
    try {
        const {name,price,productimg,des,stock,cath,nveg} = req.body
        console.log(req.body)
        if(name && price && productimg && stock && des && cath && nveg){
            const productres = new Product(req.body)
            const savepdt = await productres.save()
            res.json(savepdt)
        }else{
            res.json('enter all fields')
        }
    } catch (error) {
        console.log(error)
    }
})
route.get('/get', async(req,res)=>{
    try {
        const data = await Product.find().sort({'_id':-1})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})
route.delete('/delete/:id', async(req,res)=>{
    try {
        const data = await Product.findByIdAndRemove(req.params.id)
        const dataa = await Tproduct.findOneAndRemove({"by":req.params.id})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})
route.get('/getitem/:id', async(req,res)=>{
    try {
        const get = await Product.findById(req.params.id)
        res.json(get)
    } catch (error) {
        console.log(error)
    }
})
route.patch('/edit/:id', async(req,res)=>{
    console.log(req.body)
    try {
        const update = await Product.findByIdAndUpdate(req.params.id, req.body)
    } catch (error) {
        console.log(error)
    }
})
route.post('/tproduct', async(req,res)=>{
    // console.log(req.body)
    try {
        const data = new Tproduct({
            top:req.body,
            by:req.body
        })
        const sdata = await data.save()
        res.json(sdata)
    } catch (error) {
        console.log(error)
    }
})
route.get('/tproduct', async(req,res)=>{
    try {
        const data = await Tproduct.find().sort({'_id':-1})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})
route.delete('/tproduct/:id', async(req,res)=>{
    try {
        console.log(req.params.id)
        const del = await Tproduct.findOneAndRemove({"by":req.params.id})
        res.json(del)
    } catch (error) {
        console.log(error)
    }
})


module.exports= route