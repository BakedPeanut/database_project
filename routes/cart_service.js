const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ message: 'Fetching all carts' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Adding an item to cart' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `Updating cart item with ID: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Removing cart item with ID: ${req.params.id}` });
});

module.exports = router;
