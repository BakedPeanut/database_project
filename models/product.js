const db = require('../connector/mysql');

class Product {
    constructor(id, width, length, height, inStock, title, description, price, img, warehouseId, categoryId) {
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
    }

    // CRUD operations will be added here in the future
}

module.exports = Product;
