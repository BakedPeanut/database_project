const mongoose = require('mongoose');

const productAttributeValueSchema = new mongoose.Schema({
    productID: {
        type: Number,
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, 
        required: true
    }
});

const productAttributeSchema = new mongoose.Schema({
    attributeID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Attribute model
        required: true,
        unique: true
    },
    values: [productAttributeValueSchema]
});

const ProductAttribute = mongoose.model('ProductAttribute', productAttributeSchema);

module.exports = ProductAttribute;
