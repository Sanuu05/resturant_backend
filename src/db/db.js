const mongoose = require('mongoose')
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1337842",
    key: "acaefd0f6ede12677278",
    secret: "e7b371c5b59308a95b30",
    cluster: "ap2",
    useTLS: true
});

mongoose.connect(process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("db connect")
    }).catch((err) => {
        console.log(err)
    });
const db = mongoose.connection
db.once('open', () => {
    console.log('db connected again')
    const pdtcollection = db.collection('products')
    const changeStream = pdtcollection.watch()
    changeStream.on('change', (change) => {
        // console.log(change)
        if (change.operationType === "insert") {
            const detail = change.fullDocument;
            pusher.trigger('product', 'inserted', {
                name: detail._id
            })
        }
        if (change.operationType === 'delete') {
            const del = change.documentKey;
            pusher.trigger('products', 'deleted', {
                id: del._id
            })

        }
        if (change.operationType === 'update') {
            const update = change.updateDescription;
            pusher.trigger('prod', 'updated', {
                upd: update.updatedFields,
                img: update.updatedFields.productimg
            })
        }



    })
    const querycollection = db.collection('tproducts')
    const changeQStream = querycollection.watch()
    changeQStream.on('change', (change) => {
        // console.log("newchange",change)
        if (change.operationType === "insert") {
            const detail = change.fullDocument;
            pusher.trigger('tpdt', 'tpdtinsrt', {
                name: detail
            })
        }
        if (change.operationType === 'delete') {
            const del = change.documentKey;
            pusher.trigger('deltpdt', 'deltpdtinsrt', {
                id: del._id
            })

        }
    })

    const cartcollection = db.collection('carts')
    const changeStreamcart = cartcollection.watch()
    changeStreamcart.on('change', (change) => {
        // console.log(change)
        if (change.operationType === "insert") {
            const detail = change.fullDocument;
            pusher.trigger('cart', 'inserted', {
                name: detail._id
            })
        }
        if (change.operationType === 'delete') {
            const del = change.documentKey;
            pusher.trigger('carts', 'deleted', {
                id: del._id
            })

        }
        if (change.operationType === 'update') {
            const update = change.updateDescription;
            pusher.trigger('cartd', 'updated', {
                upd: update.updatedFields,
                img: update.updatedFields.productimg
            })
        }



    })

    const ordercollection = db.collection('orders')
    const changeStreamorder = ordercollection.watch()
    changeStreamorder.on('change', (change) => {
        console.log(change)
        if (change.operationType === "insert") {
            const detail = change.fullDocument;
            pusher.trigger('order', 'inserted', {
                name: detail._id
            })
        }
        if (change.operationType === 'delete') {
            const del = change.documentKey;
            pusher.trigger('orders', 'deleted', {
                id: del._id
            })

        }
        if (change.operationType === 'update') {
            const update = change.updateDescription;
            pusher.trigger('orderd', 'updated', {
                upd: update.updatedFields
            })
        }



    })

})

