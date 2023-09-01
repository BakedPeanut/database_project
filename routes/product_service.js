const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Create product
router.post('/create', async (req, res) => {
    try {
        const result = await Product.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.fetchById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product
router.put('/update/:id', async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.deleteById(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.selectAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
