-- Database creation
CREATE DATABASE IF NOT EXISTS database_project;
USE database_project;

-- Creating the Warehouse table
CREATE TABLE IF NOT EXISTS Warehouse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    volume INT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    role ENUM('ADMIN', 'SELLER', 'CUSTOMER') NOT NULL
) ENGINE=InnoDB;

-- Product table
CREATE TABLE IF NOT EXISTS Product (
    id INT AUTO_INCREMENT,
    width INT NOT NULL,
    length INT NOT NULL,
    height INT NOT NULL,
    inStock INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    img VARCHAR(255) NOT NULL,
    category INT NOT NULL,
    addedTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    sellerID INT,
    PRIMARY KEY (id, price, addedTime)  -- Define a composite primary key
) ENGINE=InnoDB;

-- Index for title
ALTER TABLE Product ADD INDEX idx_title(title);

-- Index for description
ALTER TABLE Product ADD INDEX idx_description(description);

-- Composite index for title and description
ALTER TABLE Product ADD INDEX idx_title_description(title, description);

-- Index for price
ALTER TABLE Product ADD INDEX idx_price(price);

-- Index for addedTime
ALTER TABLE Product ADD INDEX idx_addedTime(addedTime);

-- Index for category
ALTER TABLE Product ADD INDEX idx_category(category);

-- Partitioning by year of addedTime
ALTER TABLE Product PARTITION BY RANGE(YEAR(addedTime)) (
    PARTITION p2021 VALUES LESS THAN (2022),
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024)
);

ALTER TABLE Product
PARTITION BY RANGE(FLOOR(price)) (
    PARTITION budget VALUES LESS THAN (100),
    PARTITION mid_range VALUES LESS THAN (500),
    PARTITION high_end VALUES LESS THAN (MAXVALUE)
);
-- WarehouseProduct Relationship table
CREATE TABLE IF NOT EXISTS WarehouseProduct (
	warehouseId INT NOT NULL,
	productId INT NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (warehouseId, productId),
	FOREIGN KEY (warehouseId) REFERENCES Warehouse(id)
) ENGINE=InnoDB;

-- Cart table
CREATE TABLE IF NOT EXISTS Cart (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
	customerID INT,
	FOREIGN KEY (customerID) REFERENCES User(id)
) ENGINE=InnoDB;

-- CartDetail table
CREATE TABLE IF NOT EXISTS CartDetail (
    cartDetailId INT AUTO_INCREMENT PRIMARY KEY,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cartId) REFERENCES Cart(cartId)
) ENGINE=InnoDB;

-- Order table
CREATE TABLE IF NOT EXISTS Orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    orderStatus ENUM('Pending', 'Rejected', 'Accepted') DEFAULT 'Pending',
	customerID INT,
	FOREIGN KEY (customerID) REFERENCES User(id)
) ENGINE=InnoDB;

-- OrderDetail table
CREATE TABLE IF NOT EXISTS OrderDetail (
    orderDetailId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(orderId)
) ENGINE=InnoDB;

CREATE TABLE OrderProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT NOT NULL,
    productID INT NOT NULL,
    warehouseID INT NOT NULL,
    volume INT NOT NULL,
    quantity INT NOT NULL
) ENGINE=InnoDB;

-- Inserting into Warehouse table
INSERT INTO Warehouse (name, province, city, district, street, number, volume) VALUES
('Eastside Storage', 'Ontario', 'Toronto', 'Downtown', 'Maple St.', '45B', 5000),
('Westend Depot', 'British Columbia', 'Vancouver', 'Kitsilano', 'Cedar Ave.', '88A', 6000),
('Central Hold', 'Alberta', 'Calgary', 'Beltline', 'Pine Rd.', '190', 7000),
('Harbor Front Logistics', 'Quebec', 'Montreal', 'Old Port', 'Dock Sq.', '33F', 7500),
('Prairie Keep', 'Manitoba', 'Winnipeg', 'Core Area', 'Oak St.', '21D', 6200),
('Northern Guard', 'Yukon', 'Whitehorse', 'Downtown', 'Spruce Dr.', '5G', 6400),
('South Shore Distributors', 'Nova Scotia', 'Halifax', 'South End', 'Birch Blvd.', '99H', 6800),
('Island Vault', 'Prince Edward Island', 'Charlottetown', 'Brighton', 'Cherry Ct.', '11J', 6600),
('Metro Safehold', 'Ontario', 'Ottawa', 'Centretown', 'Elm Ln.', '77K', 7300),
('Lakeside Repository', 'Ontario', 'Windsor', 'Walkerville', 'Pecan Pl.', '3L', 7100);

INSERT INTO USER (username, password, role) values
('admin', '$2a$12$ozS8Z6Le.KohFhEZIsvHuOQuHKlF8noYTz4kqxzrUNTXLi3k3RZ1i', 'ADMIN'), -- password
('seller1', '$2a$12$YAxpwRuK4duhJq88s2Hne.HfklswgZejutdzgyzRiC1ijtKZ91Oie', 'SELLER'), -- mypassword
('seller2', '$2a$12$M87vfxG7UqhxLIm2ER1nvefN4jE.zvmvlEPEQAZzpA0rvFy.Pl6YC', 'SELLER'), -- 123456
('seller3', '$2a$12$FLD/0r76dt/SAWupJqUbgutESInXnI/bbZjsyhGFfuFpmr9NSSU/y', 'SELLER'), -- iamseller
('customer1', '$2a$12$tC0b4zCUzgZyX/vFez/WresKRMdlhlA/Y9xyazoncCxPX8yXRwCwG', 'CUSTOMER'), -- customer
('customer2', '$2a$12$HjAH03DWG4ToZ7H7VUTPW.9sbAmxcFKl6FPDP8gSKvVonT5vbVzLa', 'CUSTOMER'), -- testcustomer
('customer3', '$2a$12$Vjd51thruZsJPu/gswEs/Oa8KRDWHSh9dbTbKbgHOZcYyR611uaZq', 'CUSTOMER'); -- lastcustomer

INSERT INTO Product (width, length, height, inStock, title, description, price, img, category, sellerID) VALUES
(7, 14, 1, 100, 'Galaxy Superior X', 'Latest flagship model with 5G support', 899.99, 'galaxy_superior_x.jpg', 4, 1), 
(6, 12, 1, 200, 'Galaxy Budget Z', 'Affordable phone with decent performance', 299.99, 'galaxy_budget_z.jpg', 5, 2), 
(7, 14, 1, 150, 'Pixel Prime 6', 'Flagship phone with the best camera', 949.99, 'pixel_prime_6.jpg', 4, 3), 
(6, 12, 1, 220, 'Pixel Budget Y', 'Cost-effective Pixel experience', 329.99, 'pixel_budget_y.jpg', 5, 1), 
(5, 10, 1, 50, 'Nokia Tough 3310', 'Durable phone for all conditions', 49.99, 'nokia_tough_3310.jpg', 8, 2), 
(16, 26, 2, 100, 'Razer Blitz', 'High-end gaming laptop with RTX 3080', 1999.99, 'razer_blitz.jpg', 9, 3), 
(15, 25, 2, 180, 'Asus TUF Warrior', 'Budget gaming laptop with great performance', 999.99, 'asus_tuf_warrior.jpg', 10, 1), 
(14, 24, 1, 300, 'Dell WorkPro X9', 'Laptop designed for business efficiency', 849.99, 'dell_workpro_x9.jpg', 11, 2), 
(16, 26, 2, 90, 'Alienware Pulsar', 'Top-tier gaming experience with sleek design', 2199.99, 'alienware_pulsar.jpg', 9, 3), 
(15, 25, 2, 170, 'Lenovo BattleBox', 'Budget gaming with robust build', 949.99, 'lenovo_battlebox.jpg', 10, 1), 
(15, 23, 1, 250, 'HP EliteBook 850', 'Business laptop with secure features', 799.99, 'hp_elitebook_850.jpg', 11, 2), 
(7, 15, 1, 80, 'OnePlus Ultra 9', 'OnePlus flagship with warp charging', 799.99, 'oneplus_ultra_9.jpg', 4, 3), 
(6, 13, 1, 190, 'OnePlus Lite Z', 'OnePlus budget phone with smooth OS', 349.99, 'oneplus_lite_z.jpg', 5, 1), 
(16, 27, 2, 70, 'MSI DragonBlade', 'Ultra-performance gaming laptop', 2299.99, 'msi_dragonblade.jpg', 9, 2), 
(14, 23, 1, 330, 'Acer Swift 5', 'Lightweight business laptop', 749.99, 'acer_swift_5.jpg', 11, 3), 
(7, 14, 1, 90, 'iPhone 14 Pro', 'Apple flagship with advanced features', 999.99, 'iphone_14_pro.jpg', 4, 1), 
(6, 12, 1, 210, 'iPhone 14', 'New generation iPhone for everyone', 799.99, 'iphone_14.jpg', 5, 2), 
(15, 25, 2, 60, 'Macbook Pro 16"', 'Apple laptop for professionals', 2399.99, 'macbook_pro_16.jpg', 9, 3), 
(15, 24, 2, 140, 'Macbook Air M2', 'Lightweight and powerful Apple laptop', 1199.99, 'macbook_air_m2.jpg', 10, 1);

INSERT INTO WarehouseProduct (warehouseId, productId, quantity) VALUES
-- Product 1
(1, 1, 50), (2, 1, 30), (3, 1, 20),
-- Product 2
(2, 2, 100), (3, 2, 50), (4, 2, 50),
-- Product 3
(1, 3, 50), (2, 3, 50), (3, 3, 50),
-- Product 4
(3, 4, 110), (4, 4, 55), (5, 4, 55),
-- Product 5
(4, 5, 25), (5, 5, 25),
-- Product 6
(5, 6, 50), (6, 6, 50),
-- Product 7
(6, 7, 90), (7, 7, 90),
-- Product 8
(7, 8, 100), (8, 8, 100), (9, 8, 100),
-- Product 9
(8, 9, 45), (9, 9, 45),
-- Product 10
(9, 10, 85), (10, 10, 85),
-- Product 11
(1, 11, 100), (2, 11, 75), (3, 11, 75),
-- Product 12
(3, 12, 40), (4, 12, 40),
-- Product 13
(4, 13, 95), (5, 13, 95),
-- Product 14
(5, 14, 35), (6, 14, 35),
-- Product 15
(6, 15, 165), (7, 15, 165),
-- Product 16
(7, 16, 45), (8, 16, 45),
-- Product 17
(8, 17, 105), (9, 17, 105),
-- Product 18
(9, 18, 30), (10, 18, 30),
-- Product 19
(10, 19, 70), (1, 19, 70);




