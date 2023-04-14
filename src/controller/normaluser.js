const Normal = require("../models/NormalUser")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Razorpay = require("razorpay");
const crypto = require('crypto')
const Order = require('../models/Order')
const Productdetail = require('../models/product')
const Stripe = require('stripe')
const stripe = Stripe("sk_test_51IAFjHFZnHGlURw8uac7QJJwvhKFZJsEAnYU1RUziWv3YlJb7EsbUhBeX9Bd5oGj05eiXdKh1S3uIHwxNMsBETVm000Ml6AxPM",{
    apiVersion:"2020-08-27"
})

//TODO: SignUp

exports.signUp= async (req, res) => {
    try {
        const { name, email, password, cpassword, mobile } = req.body
        if (!name) {
            return res.status(400).json({
                msg: "enter name"
            })
        }
        if (!email) {
            return res.status(400).json({
                msg: "enter email"
            })
        } if (!mobile) {
            return res.status(400).json({
                msg: "enter mobile number"
            })
        }
        if (!password) {
            return res.status(400).json({
                msg: "enter password"
            })
        }
        if (!cpassword) {
            return res.status(400).json({
                msg: "enter confirm password"
            })
        }
        const user = await Normal.findOne({ email })
        if (user) {
            return res.status(400).json({
                msg: "user exists"
            })
        }
        if (password !== cpassword) {
            return res.status(400).json({
                msg: "enter the same password"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const userRes = new Normal({
            name,
            email,
            password: hashPassword,
            mobile

        })
        const userSave = await userRes.save()
        console.log(userSave)
        res.json("signup sucesfully")
    } catch (error) {
        console.log(error)
    }
}

//TODO: Login 

exports.Login= async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({
                msg: "fill the email feild"
            })
        }
        if (!password) {
            return res.status(400).json({
                msg: "fill the password feild"
            })
        }
        const exuser = await Normal.findOne({ email })
        if (!exuser) {
            return res.status(400).json({
                msg: "user does not exits"
            })
        }
        const isMatch = await bcrypt.compare(password, exuser.password)
        if (!isMatch) {
            return res.status(400).json({
                msg: "details doesnt match"
            })
        }
        const token = await jwt.sign({ id: exuser._id }, process.env.SEC_KEY)
        exuser.password = undefined
        res.json({
            token,
            user: exuser
        })

    } catch (error) {
        console.log(error)
    }

}
//TODO: Get User Data

exports.getUserData=async(req,res)=>{
    try {
        const userRes = await Normal.findById(req.user).sort({'_id':-1})
        if (!userRes) {
            return res.status(400).json({
                msg: "not auth user"
            })
        }
        res.json({
            user:userRes
        })
        
    } catch (error) {
        console.log(error)
    }
}

//TODO : Create Order (Website) 
exports.webOrder= async (req, res) => {
    try {
        console.log("body",req.body)
        const instance = new Razorpay({
            key_id: "rzp_test_fvOAKuvkkgRaoU",
            key_secret: "dbY34WVDWmoEItESZTx3qWMV",
        });

        const options = {
            amount: (req.body.total+(req.body.total*0.05) )* 100, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
        
    } catch (error) {
        res.status(500).send(error);
    }
};


//TODO : Success Order (Website) 
exports.webSuccessOrder=async (req, res) => {
    try {
        // getting the details back from our font-end
        console.log("sucess", req.body)
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
        console.log(req.body.totaldata.totalcart
            )

        const shasum = crypto.createHmac("sha256", "dbY34WVDWmoEItESZTx3qWMV");
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });
        const time = new Date().toLocaleString()
        const neworder = new Order({
            customerDetail:req.body.totaldata.user,
            customerOrder:req.body.totaldata.totalcart,
            totolPrice:req.body.totaldata.total,
            paymentstatus:true,
            ordertime:time
        })
        const saveorder = await neworder.save()
        const buyuser = await Normal.findById(req.user)
        const buyer = {
            by: buyuser
        }
        req.body.totaldata.totalcart.map(async (val, index) => {
            const user = await Productdetail.findById(val.cartitem)
            const update = await Productdetail.findByIdAndUpdate(val.cartitem, {
                stock: user.stock - val.qyt
            }, { new: true })
            const paybuyer = await Productdetail.findByIdAndUpdate(val.cartitem, {
                $push: {
                    buyer: buyer
                }
            })
        })
        const buyitem={
            data: {list:req.body.totaldata.totalcart,trackid:saveorder?.id,ordertime:time,total:req.body.totaldata.total}
        }
        const buyitems = await Normal.findByIdAndUpdate(req.user, {
            $push: {
                buyitem: buyitem
            }
        },{
            new:true
        })
        res.json({
            msg: "success", 
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
//TODO : Order Place (Mobile) 
exports.mobileOrder= async(req,res)=>{
    try {
        const {amount} = req.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round((amount+(amount*0.05)) * 100),
            currency: "INR",
            payment_method_types: ["card"],
          });
          const clientSecret = paymentIntent.client_secret;
          res.json({ message: "Payment initiated", clientSecret });
        
    } catch (error) {
        console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
        
    }
}
//TODO : Success Order (Mobile) 
exports.mobileSuccessOrder=async (req, res) => {
    try {
        const time = new Date().toLocaleString()
        const neworder = new Order({
            customerDetail:req.body.user,
            customerOrder:req.body.cart,
            totolPrice:req.body.total,
            paymentstatus:true,
            ordertime:time
        })
        const saveorder = await neworder.save()
        const buyuser = await Normal.findById(req.user)
        const buyer = {
            by: buyuser
        }
        req.body.cart.map(async (val, index) => {
            const user = await Productdetail.findById(val.cartitem)
            const update = await Productdetail.findByIdAndUpdate(val.cartitem, {
                stock: user.stock - val.qyt
            }, { new: true })
            const paybuyer = await Productdetail.findByIdAndUpdate(val.cartitem, {
                $push: {
                    buyer: buyer
                }
            })
        })
        const buyitem={
            data: {list:req.body.cart,trackid:saveorder?.id,ordertime:time,total:req.body.total}
        }
        const buyitems = await Normal.findByIdAndUpdate(req.user, {
            $push: {
                buyitem: buyitem
            }
        },{
            new:true
        })
        res.json("success");
    } catch (error) {
        res.status(500).send(error);
    }
};

//TODO : Get User Order Item
exports.userOrderedItem=async(req,res)=>{
    try {
        console.log(req.user)
        const data = await Normal.findById(req.user).sort({'_id':-1})
        res.json(data)
        console.log(data)
        const time = new Date().toLocaleString()
        console.log('ddd',time)
    } catch (error) {
        console.log(error)
    }
}
//TODO : Get All Order Item
exports.ordetItem= async (req, res) => {
    try {
        const order = await Order.find().sort({'_id':-1})
        res.json(order)

    } catch (error) {
        console.log(error)
    }

}

//TODO : Track Order
exports.trackOrder=async (req, res) => {
    try {
        console.log('hello',req.params.id)
        const order = await Order.findById(req.params.id)
        console.log('oo',order)
        res.json(order)

    } catch (error) {
        console.log(error)
    }

}

//TODO : Edit Order Item
exports.editOrder=async(req,res)=>{
    try {
        // console.log("ddd",req.body)
        const time = new Date().toLocaleString()
        const findedit = await Order.findByIdAndUpdate(req.params.id,{...req.body,deliverytime:req.body?.delivered?time:null})
        res.json(findedit)
    } catch (error) {
        console.log('error')
    }
}
exports.deleteOrder= async (req, res) => {

    try {
        console.log(req.params.id)
        const delorder = await Order.findByIdAndRemove(req.params.id)
        res.json(delorder)
    } catch (error) {
        console.log(error)
    }
}



