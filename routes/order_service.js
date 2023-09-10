const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const { getUserID } = require('../connector/mysql');

router.post('/', async (req, res) => {
    try {
        const customerId = getUserID();
        const result = await Order.placeOrder(customerId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const customerId = getUserID();
        const order = await Order.fetchById(customerId);
        const ordersArray = Array.isArray(order) ? result : [order];
        res.status(200).json(ordersArray);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/', async (req, res) => {
    try {
        await Order.update(getUserID, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/accept/:id', async (req, res) => {
    try {
        const customerId = getUserID();
        const result = await Order.updateStatus(customerId, true);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/reject/:id', async (req, res) => {
    try {
        const customerId = getUserID();
        const result = await Order.updateStatus(customerId, false);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;