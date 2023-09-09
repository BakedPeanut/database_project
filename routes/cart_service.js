const express = require('express');
const Cart = require('../models/cart');
const router = express.Router();

// Get request to retrieve items from user cart
router.get('/:customerId', async (req, res) => {
    const { customerId } = req.params;
    
    try {
      const products = await Cart.getProductsAndQuantitiesByCustomerId(customerId);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Post request to add a product to cart
router.post('/', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const productId = req.body.productId;
        
        if(!customerId || !productId) {
            return res.status(400).json({ message: 'customerId and productId are required' });
        }

        await Cart.addToCart(customerId, productId);
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/clear', async (req, res) => {
    try {
        const customerId = req.body.customerId;

        if(!customerId) {
            return res.status(400).json({ message: 'customerId is required' });
        }

        await Cart.clearCart(customerId);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Post request to remove an item out of cart
router.post('/remove', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const productId = req.body.productId;

        if(!customerId || !productId) {
            return res.status(400).json({ message: 'customerId and productId are required' });
        }

        await Cart.removeItem(customerId, productId);
        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post request to reduce the item quantity in cart by 1
router.post('/reduce', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const productId = req.body.productId;

        if(!customerId || !productId) {
            return res.status(400).json({ message: 'customerId and productId are required' });
        }

        await Cart.reduceItemQuantity(customerId, productId);
        res.status(200).json({ message: 'Product removed succesfully or no product left in the cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
