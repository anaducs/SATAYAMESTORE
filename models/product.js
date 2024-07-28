const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    stockCount: {
        type: Number,
        required: true
    }
})

exports.product = mongoose.model('product',productSchema)