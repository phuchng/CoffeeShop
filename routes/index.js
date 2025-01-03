var express = require('express');
var { Product } = require('../models/Product')
var router = express.Router();
var { isAdmin } = require('../middleware/authentication');

/* GET users listing. */

router.get('/', async function (req, res) {
    const productExample = await Product.find({}).limit(6);

    const topRatedProducts = await Product.find()
        .sort({ 'ratings.averageRating': -1 })
        .limit(5)
        .exec();

    return res.render('homepage', { productExample: productExample, topRated: topRatedProducts });
});

router.get('/product/:id', async function (req, res, next) {
    const productID = req.params.id;
    const productList = await Product.find({}).limit(4);
    const productDetail = await Product.findById(productID).populate('ratings.allRatings.user');

    // Handle case where product is not found
    if (!productDetail) {
        return res.status(404).render('error', { message: 'Product not found', error: { status: 404 } });
    }

    // Pagination for reviews
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedReviews = productDetail.ratings.allRatings.slice(start, end);

    const totalReviews = productDetail.ratings.allRatings.length;
    const totalPages = Math.ceil(totalReviews / perPage);

    if (req.xhr) {
        // AJAX request: Send only JSON data for reviews
        res.json({
            reviews: paginatedReviews,
            currentPage: page,
            totalPages: totalPages
        });
    } else {
        // Regular request: Render the full EJS template
        return res.render('detail', {
            title: 'Detail',
            productList: productList,
            product: productDetail,
            reviews: paginatedReviews,
            currentPage: page,
            totalPages: totalPages
        });
    }
});

router.post('/product/:id/rate', async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You must be logged in to rate a product.' });
    }

    const productId = req.params.id;
    const { rating, review } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Check if the user has already rated the product
        const existingRatingIndex = product.ratings.allRatings.findIndex(r => r.user.toString() === userId);
        if (existingRatingIndex !== -1) {
            // Update existing rating
            product.ratings.allRatings[existingRatingIndex].rating = rating;
            product.ratings.allRatings[existingRatingIndex].review = review;
        } else {
            // Add new rating
            product.ratings.allRatings.push({ user: userId, rating, review });
        }

        product.updateRatings();
        await product.save();

        res.status(200).json({ message: 'Rating updated successfully.', averageRating: product.ratings.averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update rating.' });
    }
});

router.delete('/product/:id/rate', async function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You must be logged in to delete a rating.' });
    }

    const productId = req.params.id;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        const existingRatingIndex = product.ratings.allRatings.findIndex(r => r.user.toString() === userId);
        if (existingRatingIndex === -1) {
            return res.status(404).json({ error: 'Rating not found.' });
        }

        // Remove the rating
        product.ratings.allRatings.splice(existingRatingIndex, 1);
        product.updateRatings();
        await product.save();

        res.status(200).json({ message: 'Rating deleted successfully.', averageRating: product.ratings.averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete rating.' });
    }
});

router.get('/products', async function (req, res, next) {
    let query = {};
    let sortOption = {};
    const searchTerm = req.query.search;
    const page = parseInt(req.query.page) || 1; // Get page number from query, default to 1
    const perPage = 8; // Products per page
    const skip = (page - 1) * perPage; // Calculate the number of products to skip

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

    const products = await Product.find(query).sort(sortOption).skip(skip).limit(perPage);
    const totalProducts = await Product.countDocuments(query); // Count total products matching the query
    const totalPages = Math.ceil(totalProducts / perPage); // Calculate total pages

    if (req.xhr) {
        // AJAX request: Send only JSON data
        res.json({
            products: products,
            selectedCategory: req.query.category || [],
            selectedPriceRange: req.query.priceRange || '',
            selectedGrind: req.query.grind || [],
            selectedRoast: req.query.roast || [],
            selectedSort: req.query.sort || '',
            currentPage: page,
            totalPages: totalPages
        });
    } else {
        // Regular request: Render the full EJS template
        res.render('products', {
            title: 'Search Results',
            search: searchTerm,
            products: products,
            selectedCategory: req.query.category || [],
            selectedPriceRange: req.query.priceRange || '',
            selectedGrind: req.query.grind || [],
            selectedRoast: req.query.roast || [],
            selectedSort: req.query.sort || '',
            currentPage: page,
            totalPages: totalPages
        });
    }
});

// Contact Page Route
router.get('/contact', function (req, res, next) {
    res.render('contact', { title: 'Contact' });
});

// About Page Route
router.get('/about', function (req, res, next) {
    res.render('about', { title: 'About' });
});

// Blog Page Route
router.get('/blog', function (req, res, next) {
    res.render('blog', { title: 'Blog' });
});

// Profile Page Route
router.get('/profile', function (req, res, next) {
    res.render('profile', { title: 'Profile' });
});

module.exports = router;