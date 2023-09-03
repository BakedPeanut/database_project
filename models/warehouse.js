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
            const query = "INSERT INTO warehouse SET ?";
            db.query(query, data, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static fetchById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM warehouse WHERE id = ?";
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                resolve(results[0]);
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const query = "UPDATE warehouse SET ? WHERE id = ?";
            db.query(query, [data, id], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            // Use parameterized query to count products associated with the warehouse
            const checkQuery = "SELECT COUNT(*) AS productCount FROM product WHERE warehouse_id = ?";
            db.query(checkQuery, [id], (checkErr, checkResults) => {
                if (checkErr) {
                    return reject(checkErr);
                }

                // If no associated products, proceed to delete the warehouse
                if (checkResults[0].productCount === 0) {
                    const deleteQuery = "DELETE FROM warehouse WHERE id = ?";
                    db.query(deleteQuery, [id], (deleteErr, deleteResults) => {
                        if (deleteErr) {
                            return reject(deleteErr);
                        }
                        resolve(deleteResults);
                    });
                } else {
                    // Reject with an error if there are associated products
                    reject(new Error("Cannot delete warehouse with associated products."));
                }
            });
        });
    }

    static selectAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "SELECT * FROM warehouse";
                const results = await db.query(query);
    
                // Check if results is an array of arrays
                if (Array.isArray(results) && Array.isArray(results[0])) {
                    // Extract the inner array
                    const warehouses = results[0].map(row => ({
                        id: row.id,
                        name: row.name,
                        province: row.province,
                        city: row.city,
                        district: row.district,
                        street: row.street,
                        number: row.number,
                        totalAreaVolume: row.totalAreaVolume
                    }));
                    resolve(warehouses);
                } else {
                    reject(new Error("Invalid query results format"));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    
    static moveProduct(destinationWarehouseId, productIds) {
        return new Promise((resolve, reject) => {
            // Calculate total volume of products being moved
            const calculateVolumeQuery = "SELECT SUM(width * length * height) AS totalVolume FROM product WHERE id IN (?)";
            db.query(calculateVolumeQuery, [productIds], (volumeErr, volumeResults) => {
                if (volumeErr) {
                    return reject(volumeErr);
                }

                const totalVolumeToMove = volumeResults[0].totalVolume;

                // Check if destination warehouse has enough space
                const checkSpaceQuery = "SELECT volume FROM warehouse WHERE id = ?";
                db.query(checkSpaceQuery, [destinationWarehouseId], (spaceErr, spaceResults) => {
                    if (spaceErr) {
                        return reject(spaceErr);
                    }

                    const destinationWarehouseVolume = spaceResults[0].volume;

                    if (destinationWarehouseVolume >= totalVolumeToMove) {
                        // Use prepared statement to update products with new warehouse ID
                        const updateQuery = "UPDATE product SET warehouse_id = ? WHERE id IN (?)";
                        db.query(updateQuery, [destinationWarehouseId, productIds], (updateErr, updateResults) => {
                            if (updateErr) {
                                return reject(updateErr);
                            }
                            resolve(updateResults);
                        });
                    } else {
                        reject(new Error("Destination warehouse does not have enough space."));
                    }
                });
            });
        });
    }
    
    
}
module.exports = Warehouse;
