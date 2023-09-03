const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Create Category
router.post('/', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all Categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read single Category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Category
router.delete('/', async (req, res) => {
    try {
        await Category.deleteMany({});
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;
