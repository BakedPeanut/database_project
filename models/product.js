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

    static create(product) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "INSERT INTO product SET ?";
                const result = await db.query(query, product);
                const insertedId = result.insertId;
                resolve(insertedId);
            } catch (err) {
                reject(err);
            }
        });
    }
    

    static fetchById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "SELECT * FROM product WHERE id = ?";
                const results = await db.query(query, id);
                if (results.length === 0) {
                    resolve(null); // Product not found
                    return;
                }
                const product = results[0]; // Assuming only one row is returned
                resolve(product);
            } catch (err) {
                reject(err);
            }
        });
    }
    

    static update(id, updates) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "UPDATE product SET ? WHERE id = ?";
                const result = await db.query(query, [updates, id]);
                if (result.affectedRows === 0) {
                    reject(new Error("Product not found"));
                    return;
                }
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
    

    static deleteById(id) {
        return new Promise(async (resolve, reject) => {
            const connection = await db.getConnection();
    
            try {
                await connection.beginTransaction();
    
                // Check if warehouse has associated products
                const productsQuery = "SELECT 1 FROM product WHERE warehouse_id = ?";
                const productsResult = await connection.query(productsQuery, id);
    
                if (productsResult.length > 0) {
                    await connection.rollback();
                    reject(new Error("Cannot delete warehouse with associated products"));
                    return;
                }
    
                // Delete the warehouse
                const deleteQuery = "DELETE FROM warehouse WHERE id = ?";
                const deleteResult = await connection.query(deleteQuery, id);
    
                if (deleteResult.affectedRows === 0) {
                    await connection.rollback();
                    reject(new Error("Warehouse not found"));
                    return;
                }
    
                await connection.commit();
                resolve();
            } catch (err) {
                await connection.rollback();
                reject(err);
            } finally {
                connection.release();
            }
        });
    }
    
    
    static selectAll() {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "SELECT * FROM product";
                const results = await db.query(query);
    
                // Check if results is an array of arrays
                if (Array.isArray(results) && Array.isArray(results[0])) {
                    // Extract the inner array
                    const products = results[0].map(row => ({
                        id: row.id,
                        width: row.width,
                        length: row.length,
                        height: row.height,
                        inStock: row.inStock,
                        title: row.title,
                        description: row.description,
                        price: row.price,
                        img: row.img,
                        warehouseId: row.warehouseId,
                        addedTime: row.addedTime
                    }));
                    resolve(products);
                } else {
                    reject(new Error("Invalid query results format"));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    
}
module.exports = Product;
