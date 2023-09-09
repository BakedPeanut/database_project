const db = require('../connector/mysql');

// Constructor of Warehouse model
class Warehouse {
    constructor(id, name, province, city, district, street, number, volume) {
        this.id = id;
        this.name = name;
        this.province = province;
        this.city = city;
        this.district = district;
        this.street = street;
        this.number = number;
        this.volume = volume;
    }

    // Get function to create new warehouse
    static async createWarehouse(name, province, city, district, street, number, volume) {
        try {
            const insertQuery = "INSERT INTO Warehouse (name, province, city, district, street, number, volume) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const [insertResult] = await db.pool.query(insertQuery, [name, province, city, district, street, number, volume]);
            return insertResult.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get function to get all warehouse
    static async getAllWarehouses() {
        try {
            const selectAllQuery = "SELECT * FROM Warehouse";
            const [warehouses] = await db.pool.query(selectAllQuery);
            return warehouses;
        } catch (error) {
            throw error;
        }
    }

    // Get function get warehouse by ID
    static async getWarehouseById(id) {
        try {
            const selectByIdQuery = "SELECT * FROM Warehouse WHERE id = ?";
            const [warehouse] = await db.pool.query(selectByIdQuery, [id]);
            return warehouse[0];
        } catch (error) {
            throw error;
        }
    }

    // Update warehouse function
    static async updateWarehouse(id, name, province, city, district, street, number, volume) {
        try {
            const updateQuery = "UPDATE Warehouse SET name = ?, province = ?, city = ?, district = ?, street = ?, number = ?, volume = ? WHERE id = ?";
            await db.pool.query(updateQuery, [name, province, city, district, street, number, volume, id]);
        } catch (error) {
            throw error;
        }
    }

    // Get the warehouse - product relationship, each row indicates which product at which warehouse and the quantity
    static async getWarehouseProduct() {
        try {
            const selectAllQuery = "SELECT Product.id as productID, Product.title, Product.img, Warehouse.name, Warehouse.id as warehouseID, warehouseproduct.quantity FROM Product JOIN WarehouseProduct ON Product.id = WarehouseProduct.productId JOIN Warehouse ON WarehouseProduct.warehouseId = Warehouse.id ORDER BY Product.id";
            const [warehouses] = await db.pool.query(selectAllQuery);
            return warehouses;
        } catch (error) {
            throw error;
        }
    }
    
    // Delete warehouse transaction
    static async deleteById(id) {
        const connection = await db.pool.getConnection(); 
    
        try {
            await connection.beginTransaction();  // Start the transaction.
    
            // Check if there are any products associated with the warehouse.
            const checkQuery = "SELECT COUNT(*) AS productCount FROM warehouseproduct WHERE warehouseId = ?";
            const [productCountResult] = await connection.query(checkQuery, [id]);
            const productCount = productCountResult[0].productCount;
    
            // If no products are associated with the warehouse, delete the warehouse.
            if (productCount === 0) {
                const deleteQuery = "DELETE FROM warehouse WHERE id = ?";
                await connection.query(deleteQuery, [id]);
                await connection.commit();  // Commit the transaction.
                return "Warehouse deleted successfully.";
            } else {
                await connection.rollback();  // Roll back the transaction even though we technically didn't change anything. This is to keep things consistent.
                return "Cannot delete warehouse with associated products.";
            }
        } catch (error) {
            await connection.rollback();  // If any error occurs, roll back the transaction.
            throw error;
        } finally {
            connection.release();  // Release the connection back to the pool.
        }
    }

    // Function to move a number of copies of a product from one to another warehouse
    static async moveProduct(sourceWarehouseId, destinationWarehouseId, productId, quantity) {
        const connection = await db.pool.getConnection();
    
        try {
            // Start transaction
            await connection.beginTransaction();
    
            // Calculate the product volume for a single unit
            const calculateVolumeQuery = "SELECT (width * length * height) AS unitVolume FROM product WHERE id = ?";
            const [productVolumeResult] = await connection.query(calculateVolumeQuery, productId);
            const unitVolume = productVolumeResult[0].unitVolume;
    
            // Get the quantity of the product in the source warehouse
            const sourceWarehouseQuantityQuery = "SELECT quantity FROM WarehouseProduct WHERE productId = ? AND warehouseId = ?";
            const [sourceWarehouseResult] = await connection.query(sourceWarehouseQuantityQuery, [productId, sourceWarehouseId]);

            // Inconsistent database - the product cannot be found in the sources or the quantity is not consistent
            if (!sourceWarehouseResult.length || sourceWarehouseResult[0].quantity < quantity) {
                throw new Error("Insufficient product quantity in the specified source warehouse");
            }
    
            const totalProductVolume = unitVolume * quantity;
    
            // Check available volume in the destination warehouse
            const checkSpaceQuery = "SELECT volume FROM warehouse WHERE id = ?";
            const [destinationVolumeResult] = await connection.query(checkSpaceQuery, destinationWarehouseId);
            const destinationVolume = destinationVolumeResult[0].volume;

            // Check if volume of the products in shipping of the destination warehouse
            const desOrderVolumeQuery = "SELECT SUM(volume) FROM OrderProduct WHERE warehouseID = ?";
            const [desOrderVolumeResult] = await connection.query(desOrderVolumeQuery, destinationWarehouseId);
            var desOrderVolume = desOrderVolumeResult[0].volume;
            // Assign 0 if undefinded
            if (typeof desOrderVolume === 'undefined') {
                desOrderVolume = 0;
            }       
            // Check if the new warehouse has it enough space
            if (destinationVolume - desOrderVolume >= totalProductVolume) {
    
                // Reduce the quantity in the source warehouse
                const updateSourceWarehouseProductQuery = "UPDATE WarehouseProduct SET quantity = quantity - ? WHERE productId = ? AND warehouseId = ?";
                await connection.query(updateSourceWarehouseProductQuery, [quantity, productId, sourceWarehouseId]);
    
                // Check if quantity of the product in the source warehouse is now zero, and delete if so
                const checkZeroQuantitySourceQuery = "SELECT quantity FROM WarehouseProduct WHERE productId = ? AND warehouseId = ?";
                const [sourceQuantityResult] = await connection.query(checkZeroQuantitySourceQuery, [productId, sourceWarehouseId]);
                if (sourceQuantityResult[0].quantity == 0) {
                    const deleteSourceWarehouseProductQuery = "DELETE FROM WarehouseProduct WHERE productId = ? AND warehouseId = ?";
                    await connection.query(deleteSourceWarehouseProductQuery, [productId, sourceWarehouseId]);
                }
                // Insert or update the product relationship with the destination warehouse
                const insertOrUpdateDestinationWarehouseProductQuery = `
                    INSERT INTO WarehouseProduct (productId, warehouseId, quantity) 
                    VALUES (?, ?, ?) 
                    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                `;
                await connection.query(insertOrUpdateDestinationWarehouseProductQuery, [productId, destinationWarehouseId, quantity]);
    
                // Update the volume in destination warehouse
                const updateDestinationVolumeQuery = "UPDATE warehouse SET volume = volume - ? WHERE id = ?";
                await connection.query(updateDestinationVolumeQuery, [totalProductVolume, destinationWarehouseId]);
    
                // Update the volume in source warehouse
                const updateSourceVolumeQuery = "UPDATE warehouse SET volume = volume + ? WHERE id = ?";
                await connection.query(updateSourceVolumeQuery, [totalProductVolume, sourceWarehouseId]);
    
                await connection.commit();
                return "Product moved successfully.";
            } else {
                await connection.rollback();
                return "Destination warehouse does not have enough space.";
            }
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
module.exports = Warehouse;
