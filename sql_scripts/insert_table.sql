USE database_project;

-- Insert 5 Warehouses
INSERT INTO warehouses (name, province, city, district, street, number, total_area_volume)
VALUES 
('Warehouse A', 'Province A', 'City A', 'District A', 'Street A', '10', 1000.00),
('Warehouse B', 'Province B', 'City B', 'District B', 'Street B', '20', 2000.00),
('Warehouse C', 'Province C', 'City C', 'District C', 'Street C', '30', 3000.00),
('Warehouse D', 'Province D', 'City D', 'District D', 'Street D', '40', 4000.00),
('Warehouse E', 'Province E', 'City E', 'District E', 'Street E', '50', 5000.00);

-- Insert 10 Products for the first warehouse
INSERT INTO products (width, length, height, in_stock, title, description, price, img, warehouse_id)
VALUES 
(10.5, 20.5, 15.5, 100, 'Product 1', 'Description 1', 19.99, 'img1.jpg', 1),
(11.5, 21.5, 16.5, 95, 'Product 2', 'Description 2', 29.99, 'img2.jpg', 1),
(12.5, 22.5, 17.5, 110, 'Product 3', 'Description 3', 24.99, 'img3.jpg', 1),
(13.5, 23.5, 18.5, 120, 'Product 4', 'Description 4', 39.99, 'img4.jpg', 1),
(14.5, 24.5, 19.5, 130, 'Product 5', 'Description 5', 49.99, 'img5.jpg', 1),
(15.5, 25.5, 20.5, 140, 'Product 6', 'Description 6', 59.99, 'img6.jpg', 1),
(16.5, 26.5, 21.5, 150, 'Product 7', 'Description 7', 64.99, 'img7.jpg', 1),
(17.5, 27.5, 22.5, 160, 'Product 8', 'Description 8', 74.99, 'img8.jpg', 1),
(18.5, 28.5, 23.5, 170, 'Product 9', 'Description 9', 84.99, 'img9.jpg', 1),
(19.5, 29.5, 24.5, 180, 'Product 10', 'Description 10', 94.99, 'img10.jpg', 1);
