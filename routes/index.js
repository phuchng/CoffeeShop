var express = require('express');
var product = require('../models/Product')
var router = express.Router();

/* GET users listing. */

router.get('/', (req, res) => {
  res.redirect('/search');
});

router.get('/product/:id', async function (req, res, next) {
    const productID = req.params.id;
    const productList = await product.find({}).limit(4);
    const productDetail = await product.findById(productID);
    return res.render('detail', { title: 'Detail', productList: productList, product: productDetail });
});

router.get('/search', async function (req, res, next) {
    let query = {};
    let sortOption = {};
    const searchTerm = req.query.search;

    // Search query
    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    // Filter by category
    if (req.query.category) {
        query.category = { $in: Array.isArray(req.query.category) ? req.query.category : [req.query.category] };
    }

    // Filter by price range
    if (req.query.priceRange) {
        const priceRange = req.query.priceRange.split('-');
        if (priceRange.length === 2) {
            query.price = { $gte: Number(priceRange[0]), $lte: Number(priceRange[1]) };
        } else if (req.query.priceRange === '50+') {
            query.price = { $gte: 50 };
        }
    }

    // Filter by grind
    if (req.query.grind) {
        query.grind = { $in: Array.isArray(req.query.grind) ? req.query.grind : [req.query.grind] };
    }

    // Filter by roast level
    if (req.query.roast) {
        query.roast = { $in: Array.isArray(req.query.roast) ? req.query.roast : [req.query.roast] };
    }

    // Sort options
    if (req.query.sort) {
        if (req.query.sort === 'best-selling') {
            sortOption = { sales: -1 };
        } else if (req.query.sort === 'price-low-high') {
            sortOption = { price: 1 };
        } else if (req.query.sort === 'price-high-low') {
            sortOption = { price: -1 };
        }
    }

    const products = await product.find(query).sort(sortOption);

    if (req.xhr) {
        // AJAX request: Send only JSON data
        res.json({
            products: products,
            selectedCategory: req.query.category || [],
            selectedPriceRange: req.query.priceRange || '',
            selectedGrind: req.query.grind || [],
            selectedRoast: req.query.roast || [],
            selectedSort: req.query.sort || ''
        });
    } else {
        // Regular request: Render the full EJS template
        res.render('search', {
            title: 'Search Results',
            search: searchTerm,
            products: products,
            selectedCategory: req.query.category || [],
            selectedPriceRange: req.query.priceRange || '',
            selectedGrind: req.query.grind || [],
            selectedRoast: req.query.roast || [],
            selectedSort: req.query.sort || ''
        });
    }
});

module.exports = router;