const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Product } = require('../models/product')

router.get(`/`, async (req, res) => {
    const productList = await Product.find()
    res.send(productList)
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

router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) {
            return res.status(200).json({ success: true, message: 'product deleted' });
        }
        res.status(404).json({ sucess: false, message: 'Product not found' });
    } catch (err) {
        res.status(500).json({ sucess: false, message: err })
    }
});








module.exports = router