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
    // Make an array or relevant product for each customer to display
    static async fetchById(customerID) {
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
            
            const [result] = await db.pool.query(query, [customerID]);
            
            if (result.length === 0) {
                return null; // Order not found
            }
        
            
            const orders = [];

            for (const row of result) {
                const order = {
                    orderId: row.orderId,
                    orderStatus: row.orderStatus,
                    orderDetails: JSON.parse(`[${row.orderDetails}]`)
                };
            
                orders.push(order);
            }
            
            
            return orders;
        } catch (err) {
            throw err;
        }
    }
    

    // Method to update status of the order
    static async updateStatus(id, accept) {
        try {
            var query = "UPDATE Orders SET orderStatus = 'Accepted'  WHERE orderId = ?;";
            if (!accept) {
                query = "UPDATE Orders SET orderStatus = 'Rejected'  WHERE orderId = ?;";
            }
            const [result] = await db.pool.query(query, [id]);
            console.log(id);
            return result[0];
        } catch (err) {
            throw err;
        }
    }
}
module.exports = Order;