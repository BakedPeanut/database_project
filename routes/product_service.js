const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const Category = require('../models/category');
const { getUserID } = require('../connector/mysql');

// Create product
router.post('/', async (req, res) => {
    try {
        // Extract the necessary values from the request body
        const {
            width,
            length,
            height,
            inStock,
            title,
            description,
            price,
            img,
            category,
            sellerAccount
        } = req.body;

        // Call the addProductToWarehouse method to insert the product
        const result = await Product.addProductToWarehouse(
            width,
            length,
            height,
            inStock,
            title,
            description,
            price,
            img,
            category,
            sellerAccount
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:categoryID', async (req, res) => {
    let whereConditions = [];
    let queryParams = [];

    // Search by keyword
    if (req.query.keyword) {
        whereConditions.push("(title LIKE ? OR description LIKE ?)");
        queryParams.push('%' + req.query.keyword + '%', '%' + req.query.keyword + '%');
    }

    // Filter by category
    const categoryID = req.params.categoryID;

    if (categoryID != 0) {
        const categoryList = await getAllCategoryIds(categoryID);

        // Check if no valid category IDs are found
        if (categoryList.length === 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        whereConditions.push(`category IN (?)`);
        queryParams.push(categoryList);
    }

    // Filter by price range
    if (req.query.startPrice && ! req.query.endPrice) {
        whereConditions.push("price >  ? ");
        queryParams.push(parseFloat(req.query.startPrice).toFixed(2) );
    } else if (!req.query.startPrice &&  req.query.endPrice) {
        whereConditions.push("price < ?");
        queryParams.push(parseFloat(req.query.endPrice).toFixed(2) );
    }
    else if (req.query.startPrice && req.query.endPrice) {
        whereConditions.push("price BETWEEN ? AND ?");
        queryParams.push(req.query.startPrice, req.query.endPrice);
    }

    // Sorting
    let sortBy = 'addedTime';  // default sort
    let sortDir = 'DESC';      // default direction

    if (req.query.sortBy) {
        if (['price', 'date'].includes(req.query.sortBy)) {
            if (req.query.sortBy === 'date')
                sortBy = 'addedTime';
            else {
                sortBy = req.query.sortBy;
            }
        }
    }

    if (req.query.sortDir) {
        if (['asc', 'desc'].includes(req.query.sortDir.toLowerCase())) {
            sortDir = req.query.sortDir.toUpperCase();
        }
    }

    const sqlQuery = `
        SELECT * FROM Product 
        ${whereConditions.length ? "WHERE " + whereConditions.join(' AND ') : ""}
        ORDER BY ${sortBy} ${sortDir}
    `;

    try {
        const results = await Product.queryProduct(sqlQuery, queryParams);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database query error' });
    }
});


// Update product
router.put('/update/:id', async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.deleteById(req.params.id);
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.selectAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function getAllCategoryIds(categoryId) {
  const category = await Category.findById(categoryId).exec();

  if (!category) {
    throw new Error('Category not found');
  }

  const categoryIds = [category._id];

  async function getChildrenIds(parentId) {
    const children = await Category.find({ parent: parentId }).exec();
    for (const child of children) {
      categoryIds.push(child._id);
      await getChildrenIds(child._id);
    }
  }

  await getChildrenIds(category._id);
  return categoryIds;
}

module.exports = router;
