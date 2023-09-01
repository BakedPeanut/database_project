const express = require('express');
const Warehouse = require('../models/warehouse');
const router = express.Router();

// Create warehouse
router.post('/create', async (req, res) => {
    try {
        const result = await Warehouse.create(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get warehouse by ID
router.get('/:id', async (req, res) => {
    try {
        const warehouse = await Warehouse.fetchById(req.params.id);
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update warehouse
router.put('/update/:id', async (req, res) => {
    try {
        await Warehouse.update(req.params.id, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete warehouse
router.delete('/delete/:id', async (req, res) => {
    try {
        await Warehouse.deleteById(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all warehouses
router.get('/all', async (req, res) => {
    try {
        const warehouses = await Warehouse.selectAll();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
