const express = require('express');
const Order = require('../models/order');
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const result = await Order.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const order = await Order.fetchById(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        await Order.update(req.params.id, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Order.deleteById(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const orders = await Order.selectAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;