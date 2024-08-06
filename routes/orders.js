const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/orderitem');
const { Orders } = require('../models/order');
const { Product } = require('../models/product');
const {Users}=require('../models/user');
require('dotenv');
const moongose = require('mongoose');




router.get('/', async (req, res) => {
    try {
        const orderList = await Orders.find()
            .populate('user', 'name')
            .populate({ path: 'orderItem', populate: 'product' })
            .sort({ 'dateOrdered': -1 });

        if (!orderList) {
            return res.status(404).json({ success: false, message: 'no items found' });
        }
        res.status(200).json({ success: true, orderList });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'no item found' });
        }
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
    
});
router.post('/', async (req, res,) => {
    const session = await moongose.startSession();
    session.startTransaction();
    let abortTransaction = false;
    try {
        let orderItems = await Promise.all(req.body.orderItem.map(async orderItem => {
            let newOrderItems = new OrderItem({
                product: orderItem.product,
                quantity: orderItem.quantity
            });
            
            let stock = await Product.findById(orderItem.product);
            if (!stock) {
                abortTransaction = true;
                return res.status(404).json({ message: `product ${orderItem.product} not found` });
                    
            }
            if (orderItem.quantity > stock.stockCount) {
                abortTransaction = true;
                return res.status(404).json({ message: `${stock.stockCount} stock left` });
            }
                
            if (!newOrderItems) {
                abortTransaction = true;
                return res.status(404).json({ message: 'failed to add item in cart' });
            }
            newOrderItems = await newOrderItems.save();
            return newOrderItems;
        }));
        let totaPrice = await Promise.all(orderItems.map(async orderid => {
            const priceOfOrder = await OrderItem.findById(orderid).populate('product', 'price');
            const totalPrice = priceOfOrder.product.price * priceOfOrder.quantity;
            return totalPrice;
        }));
        if (abortTransaction) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'transaction aborted' });
        }

        const totalPrice = totaPrice.reduce((a, b) => a + b, 0);
                    
        const userId = req.body.user;
        let order = new Orders({
            orderItem: orderItems,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            pincode: req.body.pincode,
            phone: req.body.phone,
            country: req.body.country,
            status: req.body.status,
            totalPrice: totalPrice,
            user: userId,
            dateOrdered: req.body.dateOrdered,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: req.body.paymentMethod === 'COD' ? 'Pending' : 'Paid',
            
        });
        order = await order.save({ session });
        if (!order) {
            abortTransaction = true;
            return res.status(404).json({ message: 'order failed' });
        }
        await session.commitTransaction();
       
        res.status(200).json(order)
        //update stock
        await Promise.all(orderItems.map(async productid => {
            await Product.findByIdAndUpdate(productid.product, { $inc: { stockCount: -productid.quantity } }, { session });
        }));
        
          
    }
    catch (err) {
        if (!abortTransaction) {
            await session.abortTransaction();
        }
         if (!res.headersSent) { // Check if headers are already sent
            res.status(500).json({ message: err.message });
        }
                   
    } finally {
       
        session.endSession();
    }
     
});
router.put('/:id', async (req, res) => {
    try {
        const order = await Orders.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
        },
            { new: true }
        );
       
        if (!order) {
           return res.status(404).json({ success: false, message: 'No order with this id' });
        }
        res.status(200).json({ success: true, order });
    } catch (err) {
        res.status(500).json({ sucess: false, message: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletord = await Orders.findById(req.params.id);
        if (!deletord) {
            return res.status(404).json({message:'order not found'});
        }
        try {
            await Promise.all(deletord.orderItem.map(async del => {
                const rm = await OrderItem.findByIdAndDelete(del);
            }));
            res.status(200).json({ sucess: true });
        } catch (err) {
            res.status(500).json({ sucess: false, message: err.message });
        }
        await Orders.findByIdAndDelete(deletord);
        
    } catch (err) {
        res.status(500).json({ sucess: false, message: err.message });
        
    }
    
});
router.get('/get/userorders/:userId', async (req, res) => {
    try {
        const user = req.params.userId;
        const userorde = await Orders.find({ user: user }).populate({
            path: 'orderItem', populate: {
                path:'product',select:'name price'
            }
        });
           

        if (!userorde ) {
            return res.status(404).json({ success: false, message: 'no items found' });
        }
        res.status(200).json({ success: true, userorde  });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });

    }
});

module.exports = router;


