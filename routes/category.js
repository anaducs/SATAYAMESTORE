const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList || categoryList.length == 0) {
           return  res.status(404).json({ Success: false,message:'no category found' });
        }
        res.status(200).send(categoryList);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/:Cid', async (req, res) => {
    try {
        const category = await Category.findById(req.params.Cid);
        if (!category) {
            return res.status(404).json({ Success: false, message: 'no category' });
        }
        res.status(200).send(category);
    } catch (err) {
        res.status(500).json({ Success: false, message:err.message });
        
    }
});
router.post('/', async (req, res) => {
    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,

        });
        category = await category.save();
        if (!category)
            return res.status(404).send("category couldn't be created!!");
        res.send(category);
    }
    catch (err) {
        res.status(500).json({success:false,message:err.message})
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)
        if (category) {
            return res.status(200).json('category deleted');
        }
        res.status(404).json({ Success: false,message:'no category found' });
    } catch (err) {
        res.status(500).json({success:false,message:'exception'})
    }
    
});
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
            {new:true}
        );
        if (!category) {
            return res.status(404).json({ success: false, message: 'category couldnt updated' });                
        }
        res.status(200).json({ success: true ,category});
            
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
        
    }
})

module.exports = router;