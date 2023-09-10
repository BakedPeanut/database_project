const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const { getUserID } = require('../connector/mysql');

// Place order method
router.post('/', async (req, res) => {
    try {
        const customerId = getUserID();
        const result = await Order.placeOrder(customerId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders method

router.get('/', async (req, res) => {
    try {
        const customerId = getUserID();
        const order = await Order.fetchById(customerId);
        const ordersArray = Array.isArray(order) ? order : [order];
        res.status(200).json(ordersArray);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Accept order request
router.post('/accept/:id', async (req, res) => {
    try {
        const result = await Order.updateStatus(req.params.id, true);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reject order request
router.post('/reject/:id', async (req, res) => {
    try {
        const customerId = getUserID();
        const result = await Order.updateStatus(req.params.id, false);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;