const db = require('../connector/mysql');

// Constructor of Product entity
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
        this.categoryId = categoryId;  
        this.addedTime = addedTime;
    }

    // Call procedure to add product
    static async addProductToWarehouse(
        width,
        length,
        height,
        inStock,
        title,
        description,
        price,
        img,
        category,
        sellerAccount
    ) {
        try {
            // Call the procedure
            const query = 'CALL AddProductToWarehouse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [
                width,
                length,
                height,
                inStock,
                title,
                description,
                price,
                img,
                category,
                sellerAccount
            ];

            const result = await db.pool.query(query, values);
            return result;
        } catch (err) {
            throw err;
        }
    }
    
    // Use for multiple field product filter. The query is passed as parameter
    static async queryProduct(sqlQuery, params) {
        try {
            const result = await db.pool.query(sqlQuery, params);
            return result[0];
        } catch (error) {
            throw error;
        }
    }
    
    // Update product
    static update(id, updates) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = "UPDATE product SET ? WHERE id = ?";
                const result = await db.pool.query(query, [updates, id]);
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
    
    // Delete product
    static deleteById(id) {
        return new Promise(async (resolve, reject) => {
            const connection = await db.pool.getConnection();
    
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
    
    // Get all product 
    static async selectAll() {
        try {
            const query = "SELECT * FROM product";
            const [results] = await db.pool.query(query);
            return results[0];

        } catch (err) {
            throw err;
        }
    }
    
}
module.exports = Product;
