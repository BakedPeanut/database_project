const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongoDB = require('./connector/mongoDB');
const { updateConnectionDetails } = require('./connector/mysql');

// Importing routes
const warehouseRoutes = require('./routes/warehouse_service');
const productRoutes = require('./routes/product_service');
const cartRoutes = require('./routes/cart_service');
const orderRoutes = require('./routes/order_service');
const categoryRoutes = require('./routes/category_service');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

connectMongoDB();

// Login routes
app.get('/login', (req, res) => {
    res.send(`
    <form action="/login" method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username">
    <br><br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password">
    <br><br>
    <input type="submit" value="Login">
</form>
    `);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userRole = await updateConnectionDetails(username, password);
    if (userRole != null) {
        req.session.user = { username };
        if(userRole === "ADMIN") {
            res.redirect('/warehouse');  
        } else if (userRole === "SELLER") {
            res.redirect('/seller');  
        } else {
            res.redirect('/');  
        }

    } else {
        res.send(`
            <script>
            alert("Invalid credentials!");
            window.location.href = '/your_desired_route_after_login';
            </script>
        `);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login'); // Redirect to the login page or any other desired route
    });
  });


// isAuthenticated Middleware
app.use((req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});
app.use(express.static(path.join(__dirname, 'public', 'build')));
app.use(express.static(path.join(__dirname, 'public_2')));

app.get('/warehouse', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_2', 'warehouse.html'));
  });
app.get('/seller', (req, res) => {
res.sendFile(path.join(__dirname, 'public_2', 'products.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'build'));
  });
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
