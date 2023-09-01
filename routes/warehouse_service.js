const express = require('express');
const Warehouse = require('../models/warehouse');
const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ message: 'Fetching all warehouses' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Adding a warehouse' });
});

router.put('/:id', (req, res) => {
    res.json({ message: `Updating warehouse with ID: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Deleting warehouse with ID: ${req.params.id}` });
});

module.exports = router;
