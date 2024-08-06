const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { count } = require('console');

router.get(`/`, async (req, res) => {
    try {
        let filter = {};
        if(req.query.categories){
           return filter = { category: req.query.categories.toString().split(',')};
        }

        const productList = await Product.find(filter).populate('category')
            if(!productList) {
            return res.status(404).json({ success: false, message: 'No Products to show' });
        }
        res.status(200).send(productList);
    } catch (err) {
        return res.status(404).json({ success: false, message: err });
    }
});
router.get(`/:id`, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, message: 'No Products to show' });
        }
        res.status(200).send(product)
    } catch (err) {
        return res.status(404).json({ success: false, message: err.message });
    }
})




router.post(`/admin`, (req, res) => {
    const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,
            stockCount: req.body.stockCount,
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

router.delete('/admin/:pid',async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid).then(product => {
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

router.put('/admin/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,
            stockCount: req.body.stockCount,
        },
            { new: true }
        );
       
        if (!product) {
            res.status(404).json({ success: false, message: 'No product with this id' });
        }
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ sucess: false, message: err.message });
    }
});

router.get(`/admin/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        if (!productCount) {
           
            return res.status(404).json({ success: false, message: 'no products' })
        }
        res.status(200).json({ count: productCount })
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
});

router.get(`/admin/get/featured/:count`, async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const featuredProduct = await Product.find({ isFeatured: true }).limit(+count);

        if (!featuredProduct || featuredProduct.length == 0) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ featuredProduct });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }

});
router.get(`/admin/get/featured/`, async (req, res) => {
    try {
        const featuredProduct = await Product.find({ isFeatured: true });

        if (!featuredProduct || featuredProduct.length==0) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ featuredProduct });
    } catch (err) {
         return res.status(500).json({ success: false,message:err.message});
    }

})




module.exports = router