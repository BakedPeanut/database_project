const db = require('../connector/mysql');

// Constructor of order
class Order {
    constructor(id, cartId, status) {
        this.id = id;
        this.cartId = cartId;
        this.status = status;
    }
    
    static async placeOrder(id) {
        try {
            const query = "call PlaceOrder(?)";
            const [result] = await db.pool.query(query, [id]);
            return result[0];    
        } catch (err) {
            throw err;
        }
    }

    // get all order from the customer
    static async fetchById(id) {
        try {
            const query = "SELECT Orders.orderId, Orders.orderStatus, OrderDetail.orderDetailId, OrderDetail.productId, OrderDetail.quantity FROM Orders LEFT JOIN OrderDetail ON Orders.orderId = OrderDetail.orderId WHERE Orders.customerID = ?";
            const [result] = await db.pool.query(query, [id]);
            return result[0];
        } catch (err) {
            throw err;
        }
      
    }

    // Method to update status of the order
    static async update(id, accept) {
        try {
            var query = "UPDATE Orders SET orderStatus = 'Accepted'  WHERE orderId = ?;";
            if (!accept) {
                query = "UPDATE Orders SET orderStatus = 'Rejected'  WHERE orderId = ?;";
            }
            const [result] = await db.pool.query(query, [id]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }
}
module.exports = Order;