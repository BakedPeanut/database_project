const db = require('../connector/mysql');

class Order {
    constructor(id, cartId, status) {
        this.id = id;
        this.cartId = cartId;
        this.status = status;
    }
    
    static create(data) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO orders SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM orders WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE orders SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM orders WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static selectAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM orders";
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = Order;