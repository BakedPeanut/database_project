use database_project;
-- Create the roles
CREATE ROLE IF NOT EXISTS Warehouse_Admin;
CREATE ROLE IF NOT EXISTS Seller;
CREATE ROLE IF NOT EXISTS Customer;

-- Grant privileges to roles

-- Admin privileges
GRANT ALL PRIVILEGES ON database_project.Warehouse TO Warehouse_Admin;
GRANT ALL PRIVILEGES ON database_project.WarehouseProduct TO Warehouse_Admin;
GRANT SELECT, UPDATE ON database_project.Product TO Warehouse_Admin;
GRANT SELECT ON database_project.OrderProduct TO Customer;

-- Seller privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.Product TO Seller;
GRANT UPDATE ON database_project.Warehouse TO Seller;
GRANT INSERT, UPDATE, DELETE ON database_project.WarehouseProduct TO Warehouse_Admin;

-- Customer privileges
GRANT SELECT ON database_project.Product TO Customer;
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.Cart TO Customer;
GRANT SELECT, INSERT, UPDATE, DELETE ON database_project.CartDetail TO Customer;
GRANT SELECT, INSERT, UPDATE ON database_project.Orders TO Customer;
GRANT SELECT, INSERT, UPDATE ON database_project.OrderDetail TO Customer;
GRANT UPDATE ON database_project.Warehouse TO Customer;
GRANT INSERT, UPDATE, DELETE ON database_project.OrderProduct TO Customer;

-- Create Admin user and grant the Admin role
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'password';
GRANT Warehouse_Admin TO 'admin'@'localhost';

-- Create Seller users and grant the Seller role
CREATE USER IF NOT EXISTS 'seller'@'localhost' IDENTIFIED BY 'password';
GRANT Seller TO 'seller'@'localhost';

-- Create Customer users and grant the Customer role
CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'password';
GRANT Customer TO 'customer'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;