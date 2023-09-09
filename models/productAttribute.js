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
// const mongoose = require('mongoose');

// const productAttributeSchema = new mongoose.Schema({
//     attribute: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Attribute', // Reference to your Attribute model
//         required: true,
//     },
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product', // Reference to your Product model
//                 required: true,
//             },
//             value: mongoose.Schema.Types.Mixed, // Allows mixed data types
//         }
//     ],
// });

// const ProductAttribute = mongoose.model('ProductAttribute', productAttributeSchema);

// module.exports = ProductAttribute;
