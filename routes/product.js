const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Product } = require('../models/product')

router.get(`/`, async (req, res) => {
    try {
        const productList = await Product.find();
        if (!productList) {
            return res.status(404).json({ success: false, message: 'No Products to show' });
        }
        res.status(200).send(productList);
    } catch (err) {
        return res.status(404).json({ success: false, message: err });
    }
});
router.get(`/:id`, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ success: false, message: 'No Products to show' });
        }
        res.status(200).send(product)
    } catch (err) {
        return res.status(404).json({ success: false, message: err.message });
    }
})




router.post(`/`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        stockCount: req.body.stockCount
    })
    product.save().then((productCreated) => {
        res.status(201).json(productCreated)
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
}
);

router.delete('/:pid',(req, res) => {
    try {
        Product.findByIdAndDelete(req.params.pid).then(product => {
            if (product) {
                return res.status(200).json({ success: true, message: 'product deleted' });
            }
            res.status(404).json({ sucess: false, message: 'Product not found' });
     
        })
    }
     catch (err) {
        res.status(500).json({ sucess: false, message: err })
    }
});








module.exports = router