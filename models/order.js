const db = require('../connector/mysql');

class Order {
    constructor(id, cartId, status) {
        this.id = id;
        this.cartId = cartId;
        this.status = status; // pending, accept, reject
    }

    // CRUD operations will be added here in the future
}

module.exports = Order;
