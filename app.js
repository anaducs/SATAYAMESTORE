const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { type } = require('express/lib/response')
require('dotenv/config')
const api = process.env.API_URL
const db_connector = process.env.Db_connection

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

//model
const productSchema = new Schema({
    name: String,
    image: String,
    stockCount: {
        type: Number,
        required: true
    }
})

const Product = mongoose.model('Product',productSchema)


app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        stockCount:req.body.stockCount
    })
    product.save().then((productCreated) => {
        res.status(201).json(productCreated)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success:false
        })
    })     
}
)
app.get(`${api}/products`, async(req, res) => {
    const productList = await Product.find()
    res.send(productList)
})
mongoose.connect(db_connector,{dbName:'Satyam'})
    .then(() => {
        console.log("connected")
    }).catch((err)=> {
    console.log(err)
    })

app.listen(3000, () => {
    
    console.log('server is listening on http://localhost:3000')
})
