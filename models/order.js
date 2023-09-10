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
    static async fetchById(orderId) {
        try {
            const query = `
                SELECT 
                    Orders.orderId, 
                    Orders.orderStatus, 
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'title', Product.title,
                            'price', Product.price,
                            'img', Product.img,
                            'quantity', OrderDetail.quantity
                        )
                    ) AS orderDetails
                FROM Orders
                LEFT JOIN OrderDetail ON Orders.orderId = OrderDetail.orderId
                LEFT JOIN Product ON OrderDetail.productId = Product.id
                WHERE Orders.customerID = ?
                GROUP BY Orders.orderId`;
            
            const [result] = await db.pool.query(query, [orderId]);
            
            if (result.length === 0) {
                return null; // Order not found
            }
            
            const order = {
                orderId: result[0].orderId,
                orderStatus: result[0].orderStatus,
                orderDetails: JSON.parse(`[${result[0].orderDetails}]`)
            };
            
            return order;
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