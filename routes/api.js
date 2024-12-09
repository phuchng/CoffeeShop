const express = require('express');
const Product = require('../models/Product'); // Adjust path as necessary
const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const { search, filter, page, limit } = req.query;

        const query = {};
        if (search) query.name = { $regex: search, $options: 'i' };
          // Case-insensitive search
        if (filter) query.category = filter;

        const pageNumber = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * itemsPerPage;

        const [products, total] = await Promise.all([
            Product.find(query).skip(skip).limit(itemsPerPage),
            Product.countDocuments(query),
        ]);

        res.json({
            products,
            total,
            page: pageNumber,
            pages: Math.ceil(total / itemsPerPage),
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;