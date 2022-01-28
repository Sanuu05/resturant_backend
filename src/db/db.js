const mongoose = require('mongoose')
const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1337842",
    key: "acaefd0f6ede12677278",
    secret: "e7b371c5b59308a95b30",
    cluster: "ap2",
    useTLS: true
});

mongoose.connect(" mongodb+srv://sanz:sannu05@cluster0.s5xci.mongodb.net/foodooze?retryWrites=true&w=majority",
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
        console.log(change)
        if (change.operationType === "insert") {
            const detail = change.fullDocument;
            pusher.trigger('product', 'inserted', {
                name: detail.name
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
        const querycollection = db.collection('queries')
        const changeQStream = querycollection.watch()
        changeQStream.on('change', (change) => {
            // console.log(change)
            if (change.operationType === "insert") {
                const detail = change.fullDocument;
                pusher.trigger('query', 'qinserted', {
                    name: detail
                })
            }
            if (change.operationType === 'delete') {
                const del = change.documentKey;
                pusher.trigger('delproduct', 'qdeleted', {
                    id: del._id
                })
    
            }
        })

    })

