const db = require('../connector/mysql');

class Product {
    constructor(id, width, length, height, inStock, title, description, price, img, warehouseId, categoryId, addedTime) {
        this.id = id;
        this.width = width;
        this.length = length;
        this.height = height;
        this.inStock = inStock;
        this.title = title;
        this.description = description;
        this.price = price;
        this.img = img;
        this.warehouseId = warehouseId;
        this.categoryId = categoryId;  // This will be utilized once you provide details about the Category.
        this.addedTime = addedTime;
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO products SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM products WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE products SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM products WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static selectAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM products";
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = Product;
