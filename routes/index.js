var express = require('express');
var { Product } = require('../models/Product');
var Category = require('../models/Category');
var router = express.Router();
var { isAdmin } = require('../middleware/authentication');

/* GET home page. */
router.get('/', async function (req, res) {
    const productExample = await Product.find({}).limit(6);

    const topRatedProducts = await Product.find()
        .sort({ 'ratings.averageRating': -1 })
        .limit(4)
        .exec();

    res.render('homepage', {
        productExample: productExample,
        topRated: topRatedProducts
    });
});

/* GET product detail page. */
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

/* POST rate a product */
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

/* DELETE a product rating */
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

/* GET product listing page */
router.get('/products', async function (req, res, next) {
    let query = {};
    let sortOption = {};
    const searchTerm = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const skip = (page - 1) * perPage;

    // Search query
    if (searchTerm) {
        query.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    // Filter by category
    if (req.query.category) {
        try {
            const category = await Category.findOne({ name: req.query.category });
            if (category) {
                query.category = category._id;
            } else {
                console.log('Category not found:', req.query.category);
                // Handle case where category is not found
                // ... (render empty list or error)
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            return res.status(500).send('Internal Server Error');
        }
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

    try {
        const products = await Product.find(query).sort(sortOption).skip(skip).limit(perPage);
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);
        const categories = await Category.find({}); // Fetch categories for filter

        if (req.xhr) {
            // AJAX request: Send only JSON data
            res.json({
                products: products,
                currentPage: page,
                totalPages: totalPages
            });
        } else {
            // Regular request: Render the full EJS template with initial product data
            res.render('products', {
                title: 'Search Results',
                search: searchTerm,
                products: products, // Pass products to the template
                categories: categories, // Pass categories to the template
                selectedCategory: req.query.category || [],
                selectedPriceRange: req.query.priceRange || '',
                selectedGrind: req.query.grind || [],
                selectedRoast: req.query.roast || [],
                selectedSort: req.query.sort || '',
                currentPage: page,
                totalPages: totalPages
            });
        }
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
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