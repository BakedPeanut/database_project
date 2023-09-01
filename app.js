const express = require('express');
const warehouseRoutes = require('./routes/warehouse_service');
const productRoutes = require('./routes/product_service');
const cartRoutes = require('./routes/cart_service');
const orderRoutes = require('./routes/order_service');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Route middleware
app.use('/warehouses', warehouseRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);

// Assuming you're serving on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app; // for potential future use and testing
