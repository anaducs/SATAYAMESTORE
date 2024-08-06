const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
        
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default:'Pending',
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        required:true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        required:true,
        
    }
});
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();

});
orderSchema.set('toJSON', {
    virtuals:true
    
})
exports.Orders = mongoose.model('Orders', orderSchema);