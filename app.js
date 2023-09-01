const express = require('express');
const bodyParser = require('body-parser');
const connectMySQL = require('./connector/mysql');
const connectMongoDB = require('./connector/mongoDB');

// Importing routes
const warehouseRoutes = require('./routes/warehouse_service');
const productRoutes = require('./routes/product_service');
const cartRoutes = require('./routes/cart_service');
const orderRoutes = require('./routes/order_service');
const categoryRoutes = require('./routes/category_service');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

connectMongoDB();

// Route Middlewares
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
module.exports = app;