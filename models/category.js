const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
    attributeName: {
        type: String,
        required: true
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
    values: [String]
    
}, {_id: false});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    attributes: [attributeSchema]
});

// Add a childCategory field that is an array of this schema
categorySchema.add({ childCategories: [categorySchema] });

// Disable the version key "__v"
categorySchema.set('versionKey', false);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
