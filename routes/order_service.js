const express = require('express');
const Order = require('../models/order');
const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ message: 'Fetching all orders' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Creating an order' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `Updating order with ID: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Deleting order with ID: ${req.params.id}` });
});

module.exports = router;
