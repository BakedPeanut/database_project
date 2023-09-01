const db = require('../connector/mysql');

class Warehouse {
    constructor(id, name, province, city, district, street, number, totalAreaVolume) {
        this.id = id;
        this.name = name;
        this.province = province;
        this.city = city;
        this.district = district;
        this.street = street;
        this.number = number;
        this.totalAreaVolume = totalAreaVolume;
    }

    static create(data) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO warehouses SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM warehouses WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE warehouses SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM warehouses WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static selectAll() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM warehouses";
            db.query(query, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }
}
module.exports = Warehouse;
