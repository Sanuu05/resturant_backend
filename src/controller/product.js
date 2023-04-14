const Product = require('../models/product')
const Tproduct = require('../models/TopPro') 



//TODO: Add New Product
exports.addData= async(req,res)=>{
    try {
        const {name,price,productimg,des,stock,cath,nveg} = req.body
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
}

//TODO: Get Product
exports.getData= async(req,res)=>{
    try {
        const data = await Product.find().sort({'_id':-1})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}

//TODO: Delete Product
exports.deleteData= async(req,res)=>{
    try {
        const data = await Product.findByIdAndRemove(req.params.id)
        const dataa = await Tproduct.findOneAndRemove({"by":req.params.id})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}
//TODO: Get Product By Id
exports.getDataById=async(req,res)=>{
    try {
        const get = await Product.findById(req.params.id)
        res.json(get)
    } catch (error) {
        console.log(error) 
    }
}

//TODO: Edit Product By Id
exports.editProduct= async(req,res)=>{
    
    try {
        const update = await Product.findByIdAndUpdate(req.params.id, req.body,{new:true})
        console.log(update)
    } catch (error) {
        console.log(error)
    }
}

//TODO: Add Top Product

exports.addTopProduct= async(req,res)=>{
    
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
}
//TODO: Get Top Product

exports.getTopProduct= async(req,res)=>{
    try {
        const data = await Tproduct.find().sort({'_id':-1})
        res.json(data)
    } catch (error) {
        console.log(error)
    }
}
//TODO: Delete Top Product
exports.deleteTopProduct= async(req,res)=>{
    try {
        const del = await Tproduct.findOneAndRemove({"by":req.params.id})
        res.json(del)
    } catch (error) {
        console.log(error)
    }
}


