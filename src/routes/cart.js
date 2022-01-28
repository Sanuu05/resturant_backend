const express = require("express")
const route = express.Router()
const Normal = require("../models/NormalUser")

const auth = require('../middleware/auth')

const Cart = require('../models/Cart')
route.get("/",(req,res)=>{
    res.json("hello cart")
})
route.post('/post', auth, async (req, res) => {
    try {
        const { cart } = req.body
        console.log(cart)
        
        
        const user = await Normal.findById(req.user)
        const cartuser = await Cart.findOne({ by: req.user })
        console.log('cART',{
            cart
        })
        if (cartuser) {
            const product = req.body.cart.cartitem
            console.log(product)
            const item = await cartuser.cart.find(c => c.cartitem == product)
            console.log("item", item)
            if (item) {
                const excart = await Cart.findOneAndUpdate({ "by": req.user, "cart.cartitem": product }, {
                    $set: {
                        "cart.$": {
                            ...cart,
                            qyt: Number(req.body.cart.qyt)
                        }
                    }
                })
                res.json(excart)
            }
            else {
                console.log("new")
                const excart = await Cart.findOneAndUpdate({ by: req.user }, {
                    $push: {
                        cart
                    }
                })
                res.json(excart)

            }

        } else {
            const cartres = new Cart({
                cart: cart,
                by: user
            })
            const cartsave = await cartres.save()
            res.json({
                cartsave
            })
        }




    } catch (error) {
        console.log(error) 
    }
})

route.get('/get', auth, async (req, res) => {
    try {
        const get = await Cart.find({ by: req.user })
        // console.log("fget",get)
        res.json(get)
    } catch (error) {
        console.log(error)
    }
})
route.delete('/del/:id', auth, async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const del = await Cart.update({ by: req.user }, {
                            $pull: {
                                cart: {
                                    cartitem: id

                                }
                            }
                        })
                        res.json(del)
                    }

        // console.log(item)
        // if (item) {
        //     console.log('gg')
        //     const del = await Cart.findOneAndRemove({ "by": req.user, "cart.cartitem": req.params.id })
        //     // console.log(del)
        //     res.json(del)

        // }


    } catch (error) {

    }
})
route.delete('/delete',auth, async(req,res)=>{
    try {
        // const {id} = req.params
        const del = await Cart.findOneAndRemove({"by":req.user})
        res.json(del)
        console.log("deleted")
    } catch (error) {
        console.log(error)
    }
})



module.exports = route