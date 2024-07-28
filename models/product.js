const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    description: {
        type: String,
        default: '',
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        reuired: true
    },
    images: [{
        type: String,
        default:'',
    }],
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        reuired: true
        
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true,
    }
    ,
    rating: {
        type: Number
    },
    numReviews: {
        type:Number,
    },
    isFeatured: {
        type: Boolean,
        default:false,
    } ,
    dateCreated: {
        type: Date,
        default: Date.now(),
    },
    stockCount: {
        type: Number,
        required: true,
        min: 0,
        max:255,
    },
 
});

exports.Product = mongoose.model('Product',productSchema)