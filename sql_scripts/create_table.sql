-- Database setup
CREATE DATABASE IF NOT EXISTS database_project;
USE database_project;

-- Warehouse table
CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(255),
    city VARCHAR(255),
    district VARCHAR(255),
    street VARCHAR(255),
    number VARCHAR(10),
    total_area_volume DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    width DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2) NOT NULL,
    height DECIMAL(10, 2) NOT NULL,
    in_stock INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    img VARCHAR(255),
    warehouse_id INT,
    category_id INT,  -- This column for future category linking
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);


-- Carts table
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    customer_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
    -- Add FOREIGN KEY for customer when customers table is defined
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    status ENUM('pending', 'accept', 'reject') NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id)
) ENGINE=InnoDB;

-- Roles & Security (assuming MySQL's native user management; adjust as per your DBMS)
CREATE USER 'customer'@'localhost' IDENTIFIED BY 'customer_password';
CREATE USER 'seller'@'localhost' IDENTIFIED BY 'seller_password';
CREATE USER 'warehouse_admin'@'localhost' IDENTIFIED BY 'admin_password';

-- Warehouse Admin: All privileges to all tables
GRANT ALL PRIVILEGES ON database_project.* TO 'warehouse_admin'@'localhost';

-- Seller: Can only set up (i.e., CRUD operations) in the products table
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.products TO 'seller'@'localhost';

-- Customer: Can view products and manipulate carts and orders
GRANT SELECT ON database_project.products TO 'customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.carts TO 'customer'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.orders TO 'customer'@'localhost';
