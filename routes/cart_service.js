const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();


router.post('/create', async (req, res) => {
    try {
        const result = await Cart.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.fetchById(req.params.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        await Cart.update(req.params.id, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Cart.deleteById(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const carts = await Cart.selectAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
