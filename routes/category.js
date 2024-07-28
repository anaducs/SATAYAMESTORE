const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList)
    {
        res.status(500).json({ Success: false })
    }
    res.send(categoryList);
});
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,

    })
    category = await category.save();
    if (!category)
        return res.status(404).send("category couldn't be created!!");
    res.send(category)
});
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id)
        if (category) {
            return res.status(200).json('category deleted');
        }
        res.status(404).json({ Success: false });
    } catch (err) {
        res.status(500).json({success:false,message:err})
    }
    
});

module.exports = router;