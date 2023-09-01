-- Database creation
CREATE DATABASE IF NOT EXISTS database_project;
USE database_project;

-- Table creation for Warehouse
CREATE TABLE IF NOT EXISTS Warehouse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    totalAreaVolume DECIMAL(10,2) NOT NULL
);

-- Table creation for Product
CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    width DECIMAL(10,2) NOT NULL,
    length DECIMAL(10,2) NOT NULL,
    height DECIMAL(10,2) NOT NULL,
    inStock INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    img VARCHAR(255),
    warehouseId INT,
    categoryId INT,
    addedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouseId) REFERENCES Warehouse(id)
    -- Assuming there will be a Category table in the future
    -- FOREIGN KEY (categoryId) REFERENCES Category(id)
);

-- Table creation for Cart
CREATE TABLE IF NOT EXISTS Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT,
    quantity INT NOT NULL,
    customerId INT,
    FOREIGN KEY (productId) REFERENCES Product(id)
    -- Assuming there will be a Customer table in the future
    -- FOREIGN KEY (customerId) REFERENCES Customer(id)
);

-- Table creation for Order
CREATE TABLE IF NOT EXISTS `Order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT,
    status ENUM('pending', 'accept', 'reject') NOT NULL,
    FOREIGN KEY (cartId) REFERENCES Cart(id)
);

-- User roles (for your DBMS setup and not directly executed in the database)
GRANT ALL PRIVILEGES ON database_project.* TO 'warehouse_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE ON database_project.Product TO 'seller'@'localhost';
GRANT SELECT ON database_project.Product TO 'customer'@'localhost';
GRANT INSERT, SELECT ON database_project.Cart TO 'customer'@'localhost';
GRANT INSERT, SELECT ON database_project.Order TO 'customer'@'localhost';
FLUSH PRIVILEGES;
