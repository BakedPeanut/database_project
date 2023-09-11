// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connectMongoDB = require("./connector/mongoDB");
const { updateConnectionDetails } = require("./connector/mysql");

// Importing routes
const warehouseRoutes = require("./routes/warehouse_service");
const productRoutes = require("./routes/product_service");
const cartRoutes = require("./routes/cart_service");
const orderRoutes = require("./routes/order_service");
const categoryRoutes = require("./routes/category_service");
const path = require("path");

const app = express();

// Create session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
connectMongoDB();

// Login routes
// Define a login route (GET request)
app.get("/login", (req, res) => {
  // Serve an HTML login form
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    /* custom-styles.css */
    
    /* Add your custom styles here */
    .container {
      max-width: 400px; /* Adjust the container width as needed */
      margin-top: 200px;
      margin-left: 200px;

    }
    
    /* Style form elements */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      font-size: 16px;
    }
    
    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }
    
    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
    
    .btn-lg {
      padding: 0.2rem 1rem;
      font-size: 1.25rem;
      line-height: 1.5;
      border-radius: 0.3rem;
      color: white; 
      display:flex;
      justify-content: center;
    }
    
    
    </style>
    </head>
    <body>
    
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Form</title>
        
        <!-- Link Bootstrap CSS (use your own path) -->
        <link href="/path/to/bootstrap.css" rel="stylesheet">
        
        <!-- Link your custom CSS file -->
        <link href="/path/to/custom-styles.css" rel="stylesheet">
    </head>
    <body>
        <form action="/login" method="post" class="container">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" class="form-control">
            </div>
            <br>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" class="form-control">
            </div>
            <br>
            <input type="submit" value="Login" class="btn btn-primary btn-lg btn-light">
        </form>
    </body>
    </html>
    
    </body>
    </html>
    `);
});

// Handle login request (POST request)
app.post("/login", async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  // Validate user credentials
  const userRole = await updateConnectionDetails(username, password); // Check user input
  if (userRole != null) {
    // Valid input - set user session and redirect based on user role
    req.session.user = { username };
    if (userRole === "ADMIN") {
      res.redirect("/warehouse");
    } else if (userRole === "SELLER") {
      res.redirect("/seller");
    } else {
      res.redirect("/");
    }
  } else {
    // Invalid input - show an alert and redirect
    res.send(`
            <script>
            alert("Invalid credentials!");
            window.location.href = '/your_desired_route_after_login';
            </script>
        `);
  }
});

// Logout route
app.get("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    } else {
      res.redirect("/");
      console.log(123);
    }
  });
});

// isAuthenticated Middleware
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});

// Serve static files (e.g., HTML, CSS, JavaScript) from the 'public' directory
app.use(express.static(path.join(__dirname, "public", "build")));
app.use(express.static(path.join(__dirname, "public_2")));

// Define routes for various API services
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

// Serve HTML files for specific routes
app.get("/warehouse", (req, res) => {
  res.sendFile(path.join(__dirname, "public_2", "warehouse.html"));
});
app.get("/seller", (req, res) => {
  res.sendFile(path.join(__dirname, "public_2", "products-seller.html"));
});

// Catch-all route to serve the main HTML file for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the app for testing or reuse
module.exports = app;
