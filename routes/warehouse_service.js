const express = require('express');
const Warehouse = require('../models/warehouse');
const router = express.Router();
const { getUserID } = require('../connector/mysql');

// Create warehouse
router.post('/', async (req, res) => {
    try {
        const { name, province, city, district, street, number, volume } = req.body;
        const result = await Warehouse.createWarehouse(name, province, city, district, street, number, volume);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get warehouse by ID
router.get('/:id', async (req, res) => {
    try {
        const warehouse = await Warehouse.getWarehouseById(req.params.id);
        res.status(200).json(warehouse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update warehouse
router.put('/:id', async (req, res) => {
    try {
        const { name, province, city, district, street, number, volume } = req.body;
        await Warehouse.updateWarehouse(req.params.id, name, province, city, district, street, number, volume);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete warehouse
router.delete('/:id', async (req, res) => {
    try {
        const result = await Warehouse.deleteById(req.params.id); // Call the function
        if (result === "Warehouse deleted successfully.") {
            res.status(200).json({ message: result }); // Success response
        } else {
            res.status(500).json({ message: result }); // Bad request, indicating that deletion wasn't possible due to associated products
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get relationtionship product and warehouse
router.get('/inventory/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const test = await Warehouse.getWarehouseProduct(); 
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all warehouses
router.get('/', async (req, res) => {
    try {
        const warehouses = await Warehouse.getAllWarehouses();
        res.status(200).json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Move product to another warehouse
// A body should have the id of the source and des warehouse, the product and the number of copies
router.post('/move', async (req, res) => {
    const { destinationWarehouseId,sourceWarehouseID, productId, quantity } = req.body;
    try {
        const result = await Warehouse.moveProduct(sourceWarehouseID, destinationWarehouseId, productId, quantity);
        res.status(200).json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error moving product.' });
    }
});

module.exports = router;
