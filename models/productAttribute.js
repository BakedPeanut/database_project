const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
    productID: {
        type: Number, // Assuming productID is a Number
        required: true,
    },
    attributeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attribute', // Reference to your Attribute model
        required: true,
    },
    value: mongoose.Schema.Types.Mixed, // Allows mixed data types
});

const ProductAttribute = mongoose.model('ProductAttributes', productAttributeSchema);

module.exports = ProductAttribute;
