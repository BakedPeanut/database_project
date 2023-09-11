const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const Category = require('../models/category');
const { getUserID } = require('../connector/mysql');
const ProductAttribute = require('../models/productAttribute')

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
            category        } = req.body;
        console.log(req.body);
        const sellerID = getUserID();
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
            sellerID
        );

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get and filter products
router.get('/:categoryID', async (req, res) => {
    let whereConditions = [];
    let queryParams = [];
    
    // Search by keyword in Product_FullText
    if (req.query.keyword) {
        whereConditions.push(`MATCH(pf.title, pf.description) AGAINST (?)`);
        queryParams.push(req.query.keyword);
    }
    
    // Filter by category
    const categoryID = req.params.categoryID;
    
    if (categoryID != 0) {
        const categoryList = await getAllCategoryIds(categoryID);
    
        // Check if no valid category IDs are found
        if (categoryList.length === 0) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
    
        whereConditions.push(`p.category IN (?)`);
        queryParams.push(categoryList);
    }
    
    // Filter by price range
    if (req.query.startPrice && !req.query.endPrice) {
        whereConditions.push("p.price > ?");
        queryParams.push(parseFloat(req.query.startPrice).toFixed(2));
    } else if (!req.query.startPrice && req.query.endPrice) {
        whereConditions.push("p.price < ?");
        queryParams.push(parseFloat(req.query.endPrice).toFixed(2));
    } else if (req.query.startPrice && req.query.endPrice) {
        whereConditions.push("p.price BETWEEN ? AND ?");
        queryParams.push(parseFloat(req.query.startPrice).toFixed(2), parseFloat(req.query.endPrice).toFixed(2));
    }
    
    // Sorting
    let sortBy = 'p.addedTime';  // default sort
    let sortDir = 'DESC';        // default direction
    
    if (req.query.sortBy) {
        if (['price', 'addedTime'].includes(req.query.sortBy)) {
            if (req.query.sortBy === 'date') {
                sortBy = 'p.addedTime';
            } else {
                sortBy = 'p.' + req.query.sortBy;
            }
        }
    }
    
    if (req.query.sortDir) {
        if (['asc', 'desc'].includes(req.query.sortDir.toLowerCase())) {
            sortDir = req.query.sortDir.toUpperCase();
        }
    }

    const sqlQuery = `
        SELECT p.* 
        FROM Product p
        LEFT JOIN Product_FullText pf ON p.id = pf.productID
        ${whereConditions.length ? "WHERE " + whereConditions.join(' AND ') : ""}
        ORDER BY 
            ${sortBy} ${sortDir}
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

router.put('/update/attribute/:id', async (req, res) => {
    try {
        const options = {
            upsert: true, // This will insert a new doc if one doesn't exist, and update if it does.
            new: true, // This will return the updated doc (or the newly inserted one)
        };
        for (const item of req.body.requestData)    {
            let filter = {
                productID: req.params.id,
                attributeID: item.attributeID
            };

            // Use await to ensure the update operation is complete
            await ProductAttribute.findOneAndUpdate(filter, { value: item.value }, options);
        }
        
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
        const userID = getUserID();
        const products = await Product.selectAll(2);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/abc/', async (req, res) => {
    try {
        const categories = await ProductAttribute.find({});
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all children from a parent category
async function getChildrenIds(parentId) {

    const children = await Category.find({ parent: parentId }).exec();
    for (const child of children) {
      categoryIds.push(child._id);
      await getChildrenIds(child._id);
    }
}

// Function to retrieve all category id and children
async function getAllCategoryIds(categoryId) {
  const category = await Category.findById(categoryId).exec();

if (!category) {
throw new Error('Category not found');
}


  const categoryIds = [category._id];

  await getChildrenIds(category._id);
  return categoryIds;
}

module.exports = router;
