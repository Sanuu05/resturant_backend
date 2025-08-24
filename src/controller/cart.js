const Normal = require("../models/NormalUser")
const Cart = require('../models/Cart')

//TODO: Add To Cart
exports.addCart= async (req, res) => {
    try {
        const { cart } = req.body
        const user = await Normal.findById(req.user)
        const cartuser = await Cart.findOne({ by: req.user })
        if (cartuser) {
            const product = req.body.cart.cartitem
            const item = user.cart.find(c => c.cartitem == product)
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
}

//TODO: Get Cart Data
exports.getCart= async (req, res) => {
    try {
        const get = await Cart.find({ by: req.user })
        res.json(get)
    } catch (error) {
        console.log(error)
    }
}
//TODO: Remove Cart Item

exports.deleteById=async (req, res) => {
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

    } catch (error) {

    }
}

//TODO: Delete Cart After Success
exports.successDelete=async(req,res)=>{
    try {
        // const {id} = req.params
        const del = await Cart.findOneAndRemove({"by":req.user})
        res.json(del)
        console.log("deleted")
    } catch (error) {
        console.log(error)
    }
}


