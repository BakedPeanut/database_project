const mongoose = require('mongoose');

// Entity for relationship between product and attribute
const productAttributeSchema = new mongoose.Schema({
    productID: {
        type: Number, // Assuming productID is a Number
        required: true,
    },
    attributeID: {
        type: String,
        required: true,
    },
    value: mongoose.Schema.Types.Mixed, // Allows mixed data types
});

const ProductAttribute = mongoose.model('product-attributes', productAttributeSchema);

module.exports = ProductAttribute;
