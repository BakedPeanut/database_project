const db = require("../connector/mysql");

// Constructor of Product entity
class Product {
  constructor(
    id,
    width,
    length,
    height,
    inStock,
    title,
    description,
    price,
    img,
    warehouseId,
    categoryId,
    addedTime
  ) {
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
      const query = "CALL AddProductToWarehouse(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        sellerAccount,
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
        // Check the current inventory of the product
        const selectQuery = "SELECT instock FROM product WHERE id = ?";
        const [currentInstockRows] = await db.pool.query(selectQuery, [id]);

        const currentInstock = currentInstockRows[0].instock;

        // If the new inventory is less than the current, call a procedure to update it
        if (currentInstock < updates.inStock) {
          const query = "CALL UpdateProductQuantity(?,?)";
          const result = await db.pool.query(query, [id, updates.inStock]);
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

        // If associated products exist, rollback the transaction
        if (productsResult.length > 0) {
          await connection.rollback();
          reject(new Error("Cannot delete warehouse with associated products"));
          return;
        }

        // Delete the warehouse
        const deleteQuery = "DELETE FROM warehouse WHERE id = ?";
        const deleteResult = await connection.query(deleteQuery, id);

        // If no rows were affected, the warehouse was not found
        if (deleteResult.affectedRows === 0) {
          await connection.rollback();
          reject(new Error("Warehouse not found"));
          return;
        }

        // Commit the transaction
        await connection.commit();
        resolve();
      } catch (err) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        reject(err);
      } finally {
        // Release the database connection
        connection.release();
      }
    });
  }

  // Get all product
  static async selectAll(sellerID) {
    try {
      const connection = await db.pool.getConnection();
      const query = "SELECT * FROM product WHERE sellerID = ?";
      const [results] = await connection.query(query, [sellerID]);
      return results;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Product;
