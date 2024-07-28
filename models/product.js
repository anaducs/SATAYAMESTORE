const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    description: String,
    richDescription: String,
    image: {
        type: String,
        reuired: true
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        reuired: true
        
    },
    rating: {
        type: Number
    },
    isFeatured: Boolean,
    dateCreated: Date,
    stockCount: {
        type: Number,
        required: true
    },
 
});

exports.Product = mongoose.model('Product',productSchema)