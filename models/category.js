const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    attributeName: {
        type: String,
        required: true,
    },
    isRequired: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'number'],
        required: true
    },
});

const categorySchema = new mongoose.Schema({
    _id: {
        type: Number, // Use Number type for _id
        unique: true,
        required: true,
        default: () => Math.floor(Math.random() * 100000) // Auto-generate a unique _id
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    attributes: {
        type: [attributeSchema],
        default: []
    },
    
    parent: {
        type: Number, 
        ref: 'Category', 
        default: null
    }
});

// Disable the version key "__v"
categorySchema.set('versionKey', false);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
