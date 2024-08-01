const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/orderitem');
const { Users } = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const orderList = await OrderItem.find().select('name -_id');

        if (!orderList) {
            return res.status(404).json({ success: false, message: 'no items found' });
        }
        res.status(200).json({ success: true, orderList });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
});

router.get('/:id', async (req, res) => {
    
})


