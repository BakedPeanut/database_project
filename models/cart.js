const db = require('../connector/mysql');

class Cart {
    constructor(id, productId, quantity, customerId) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.customerId = customerId;  // This will be utilized once you provide details about the Customer.
    }


    static create(data) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO carts SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM carts WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE carts SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM carts WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static selectAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM carts";
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = Cart;