const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ message: 'Fetching all products' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Adding a product' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `Updating product with ID: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Deleting product with ID: ${req.params.id}` });
});

module.exports = router;
