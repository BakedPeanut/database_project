const db = require('../connector/mysql');

class Cart {
    constructor(id, productId, quantity, customerId) {
        this.id = id;
        this.productId = productId;
        this.quantity = quantity;
        this.customerId = customerId;
    }

    // CRUD operations will be added here in the future
}

module.exports = Cart;
