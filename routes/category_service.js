const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { getUserID } = require('../connector/mysql');

// Create Category
router.post('/', async (req, res) => {
    try {
        const categoriesToAdd = req.body; 
        const insertedCategories = await Category.insertMany(categoriesToAdd);
        res.status(201).json(insertedCategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add attribute

// Read all Categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tree', async (req, res) => {
    try {
        const allCategories = await Category.find();
        const tree = [];
        
        for (const category of allCategories) {
            if (category.parent === null) {
                const categoryWithChildren = {
                    ...category._doc,
                    children: getChildCategories(category._id, allCategories)
                };
                tree.push(categoryWithChildren);
            }
        }

        res.json(tree);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read single Category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/:categoryId/attributes', async (req, res) => {
    const categoryId = req.params.categoryId;
    const attributes = [];

    let currentCategoryId = categoryId;
    while (currentCategoryId) {
        const category = await Category.findById(currentCategoryId);
        if (!category) {
            res.status(404).json({ error: 'Category not found' });
            return;
        }

        attributes.push(...category.attributes);
        currentCategoryId = category.parent;
    }

    res.json(attributes);
});

router.get('/:id/childAttributes', async (req, res) => {
    try {
        const attributes = await getAllAttributes(req.params.id);
        res.status(200).send(attributes);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete Category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send();
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Define the POST route to add data to the database
router.post('/addProductAttribute', async (req, res) => {
    try {
      const productAttributeData = req.body; // Assuming the request body contains the JSON data
  
      // Create a new ProductAttribute document and save it to the database
      const productAttribute = new ProductAttribute(productAttributeData);
      await productAttribute.save();
  
      res.status(201).json({ message: 'ProductAttribute added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
function getChildCategories(parentId, allCategories) {
    const children = allCategories.filter(category => category.parent === parentId);
    if (!children.length) {
        return [];
    }
    return children.map(child => {
        return {
            ...child._doc,
            children: getChildCategories(child._id, allCategories)
        };
    });
}
async function getAllAttributes(categoryId) {
    const categories = await Category.find({ parent: categoryId });
    const attributes = [];

    for (const category of categories) {
        attributes.push(...(category.attributes || []));
        const subcategoryAttributes = await getAllAttributes(category._id);
        attributes.push(...subcategoryAttributes);
    }

    return attributes;
}
module.exports = router;
