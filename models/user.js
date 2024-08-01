const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
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
    isAdmin: {
        type: Boolean,
        default:false, 
    },
    apartment: {
        type: String,
        default:'',
        
    },
    street: {
        type: String,
        default:'',
    },        
});
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', {
    virtuals: true,
});
exports.Users = mongoose.model('Users', userSchema);