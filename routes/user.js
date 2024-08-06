const express = require('express');
const router = express.Router();
const { Users } = require('../models/user')
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');

require('dotenv/config');
const secret = process.env.Secret;

router.get('/', async (req, res) => {
    try {
        const userList = await Users.find().select('-passwordHash');;
        if (!userList) {
            return res.status(404).json({ success: false, message: 'no user found' });
        }
        res.status(200).json(userList );
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, message: 'no user found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.put('/:uid', async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.params.uid,
            {
                name: req.body.name,
                email: req.body.email,
                passwordHash:bcrypt.hashSync(req.body.password,10),
                city: req.body.city,
                pincode: req.body.pincode,
                country: req.body.country,
                phone: req.body.phone,
                isAdmin:req.body.isAdmin,
                apartment: req.body.apartment,
                street: req.body.street,
            },
            { new: true },
        );
        if (!user) {
            return res.status(404);
        }
        res.status(200).json(user);
    
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
 
router.post('/', async (req, res) => {
    try {
        let user = new Users({
            name: req.body.name,
            email: req.body.email,
            passwordHash:bcrypt.hashSync(req.body.password,10),
            city: req.body.city,
            pincode: req.body.pincode,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            street: req.body.street,

        });
        user = await user.save();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User creation failed' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removeUser = await Users.findByIdAndDelete(req.params.id);
        if (!removeUser) {
            return res.status(404).json({ success: false, message: 'Unable to delete user' });
        }
        res.status(200).json({ success: true, message: 'user removed' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
        
});

router.post('/login', async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = webToken.sign({
                userId: user.id,
                isAdmin: user.isAdmin,
               
            },
            secret,
                { expiresIn: '1w' });
            return res.status(200).json({ success: true, user: user.email, token: token });
           
        }
        res.status(404).json({ success: false, message: 'Invalid password/username' });
        
    } catch (err) {
         res.status(500).json({ success: false, message: err.message });
    }
});
router.post('/register', async (req, res) => {
    try {
        let user = new Users({
            name: req.body.name,
            email: req.body.email,
            passwordHash:bcrypt.hashSync(req.body.password,10),
            city: req.body.city,
            pincode: req.body.pincode,
            country: req.body.country,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            street: req.body.street,

        });
        user = await user.save();
        if (!user) {
            return res.status(404).json({ success: false, message: 'User creation failed' });
        }
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
router.get('/get/count', async (req, res) => {
    try {
        const userCount = await Users.countDocuments;
        if (!userCount) {
            return res.status(404).json({ success: false, message: 'no userfound' });
        }
        res.status(200).json({ success: true, userCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});
    module.exports = router;