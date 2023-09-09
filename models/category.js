const mongoose = require('mongoose');

// A schema for attribute. One category with have a list of attribute
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
    _id: {
        type: String, // You can change the type as needed
        default: () => new mongoose.Types.ObjectId().toString(), // Auto-generate a custom ID if not provided
    }
});

// 
const categorySchema = new mongoose.Schema({
    _id: {
        type: Number, // Use Number type for _id
        unique: true,
        required: true,
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


// This part is to add mock data first created
const mockCategoryData = 
    [
        {
            "_id": 1,
            "name": "Electronics",
            "attributes": [
                {
                    "attributeName": "Warranty Period (Months)",
                    "isRequired": true,
                    "type": "number"
                }
            ],
            "parent": null
        },
        {
            "_id": 2,
            "name": "Mobile Phones",
            "attributes": [
    
            ],
            "parent": 1
        },
        {
            "_id": 4,
            "name": "Flagship Models",
            "attributes": [],
            "parent": 2
        },
        {
            "_id": 5,
            "name": "Budget Models",
            "attributes": [],
            "parent": 3
        },
        {
            "_id": 7,
            "name": "Laptops",
            "attributes": [
                {
                    "attributeName": "Storage Type",
                    "isRequired": false,
                    "type": "text"
                },
                {
                    "attributeName": "RAM Size",
                    "isRequired": false,
                    "type": "number",
                    "_id": "testID"
                }
            ],
            "parent": 1
        },
        {
            "_id": 8,
            "name": "Gaming Laptops",
            "attributes": [],
            "parent": 7
        },
        {
            "_id": 9,
            "name": "High-end Gaming",
            "attributes": [],
            "parent": 8
        },
        {
            "_id": 11,
            "name": "Business Laptops",
            "attributes": [],
            "parent": 7
        },
        {
            "_id": 12,
            "name": "Fashion",
            "attributes": [],
            "parent": null
        },
        {
            "_id": 13,
            "name": "Clothing",
            "attributes": [],
            "parent": 12
        },
        {
            "_id": 14,
            "name": "Footwear",
            "attributes": [],
            "parent": 12
        },
        {
            "_id": 15,
            "name": "Accessories",
            "attributes": [],
            "parent": 12
        },
        {
            "_id": 16,
            "name": "Jewelry",
            "attributes": [],
            "parent": 15
        }
    ];

async function checkAndInsertCategories() {
    try {
      // Check if the Category collection is empty
      const count = await Category.countDocuments();
  
      if (count === 0) {
        // If there are no documents, insert the data
        await Category.insertMany(mockCategoryData);
        console.log('Data inserted successfully.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Call the function to check and insert data
  checkAndInsertCategories();
  module.exports = Category;
