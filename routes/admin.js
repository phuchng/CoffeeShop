const express = require('express');
const router = express.Router();
const { Product, Tag } = require('../models/Product');
const Account = require('../models/Account');
const { isAdmin } = require('../middleware/authentication');
const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');


// Function to render admin pages with AJAX support
function renderAdminPage(req, res, page, options = {}) {
    if (req.xhr) {
        // For AJAX requests, send only the partial content
        res.render(`Admin/${page}`, { ...options, layout: false });
    } else {
        // For regular requests, render the full layout
        res.render(`Admin/${page}`, { ...options, layout: 'layouts/layoutAdmin' });
    }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const totalUsers = await Account.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments({});
        renderAdminPage(req, res, 'ADashboard', { totalUsers, totalProducts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - GET
router.get('/products/add', isAdmin, async (req, res) => {
    try {
        //const tags = await Tag.find({}); // Remove Tag reference
        const categories = await Category.find({});
        renderAdminPage(req, res, 'AAddProduct', { categories }); // Remove tags
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - POST
router.post('/products/add', isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, category, servingOptions, grind, roast, origin, ingredients, status } = req.body;

        const imagePaths = req.files.map(file => file.filename);
        const firstImagePath = imagePaths.length > 0 ? imagePaths[0] : null;

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            servingOptions: servingOptions.split(','),
            grind,
            roast,
            origin,
            ingredients: ingredients.split(','),
            image: firstImagePath,
            images: imagePaths,
            status: status || 'On stock' // Default to 'On stock' if not provided
        });

        await newProduct.save();
        // Send a JSON response for AJAX success
        res.json({ message: 'Product added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Product - GET
router.get('/products/update/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find({});
        if (!product) {
            return res.status(404).send('Product not found');
        }
        renderAdminPage(req, res, 'AUpdateProduct', { product, categories }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Product - POST
router.post('/products/update/:id', isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, category, servingOptions, grind, roast, origin, ingredients, status } = req.body;
        const currentProduct = await Product.findById(req.params.id);

        // Handle new image uploads
        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            newImagePaths = req.files.map(file => file.filename);
        }

        // Combine with existing images if any
        const updatedImagePaths = currentProduct.images.concat(newImagePaths);
        const firstImagePath = updatedImagePaths.length > 0 ? updatedImagePaths[0] : null;

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            description,
            category,
            servingOptions: servingOptions.split(','),
            grind,
            roast,
            origin,
            ingredients: ingredients.split(','),
            image: firstImagePath,
            images: updatedImagePaths,
            status
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Remove Image from Product - POST
router.post('/products/remove-image/:id', isAdmin, async (req, res) => {
    try {
        const { image } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove the image from the images array
        product.images = product.images.filter(img => img !== image);

        // If the removed image was the primary image, update the primary image
        if (product.image === image) {
            product.image = product.images.length > 0 ? product.images[0] : null;
        }

        await product.save();
        res.json({ message: 'Image removed successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove image' });
    }
});

// Delete Product
router.delete('/products/delete/:id', isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Product Detail
router.get('/products/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        renderAdminPage(req, res, 'Adetail', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Admin Profile - GET
router.get('/profile', isAdmin, (req, res) => {
    renderAdminPage(req, res, 'AProfile', { admin: req.user });
});

// Change Password - GET
router.get('/change-password', isAdmin, (req, res) => {
    renderAdminPage(req, res, 'AChangePass');
});

// Change Password - POST
router.post('/change-password', isAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const admin = await Account.findById(req.user.id);

        if (!await bcrypt.compare(currentPassword, admin.password)) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: 'New passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.json({ message: 'Password changed successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Create New Admin - GET
router.get('/create-admin', isAdmin, (req, res) => {
    renderAdminPage(req, res, 'ACreateNewAdmin');
});

// Create New Admin - POST
router.post('/create-admin', isAdmin, async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const existingAdmin = await Account.findOne({ email });
        if (existingAdmin) {
            return res.status(400).send('Admin already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Account({
            first_name: 'Admin', // You can customize this
            last_name: 'User',
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await newAdmin.save();
        res.json({ message: 'Admin created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Manage Categories - GET
router.get('/categories', isAdmin, async (req, res) => {
    try {
        const categories = await Category.find({});
        renderAdminPage(req, res, 'ACategories', { categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Category - POST
router.post('/categories/add', isAdmin, async (req, res) => {
    try {
        const { name, description, subcategories } = req.body;
        const subcategoriesArray = subcategories ? subcategories.split(',').map(s => s.trim()) : [];
        const newCategory = new Category({ name, description, subcategories: subcategoriesArray });
        await newCategory.save();
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Category - POST
router.post('/categories/update/:id', isAdmin, async (req, res) => {
    try {
        const { name, description, subcategories } = req.body;
        const subcategoriesArray = subcategories ? subcategories.split(',').map(s => s.trim()) : [];
        await Category.findByIdAndUpdate(req.params.id, { name, description, subcategories: subcategoriesArray });
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete Category - POST
router.post('/categories/delete/:id', isAdmin, async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Manage Users - GET
router.get('/users', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        let query = {};
        let sortOption = {};

        // Filter by name
        if (req.query.name) {
            const nameRegex = new RegExp(req.query.name, 'i');
            query.$or = [{ first_name: nameRegex }, { last_name: nameRegex }];
        }

        // Filter by email
        if (req.query.email) {
            query.email = new RegExp(req.query.email, 'i');
        }

        // Sort options
        if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case 'name':
                    sortOption = { first_name: 1 };
                    break;
                case 'email':
                    sortOption = { email: 1 };
                    break;
                case 'registration':
                    sortOption = { createdAt: -1 };
                    break;
                case 'role':
                    sortOption = { role: 1 };
                    break;
            }
        }

        const users = await Account.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(perPage);

        const totalUsers = await Account.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / perPage);

        if (req.xhr) {
            // AJAX request: Send only JSON data
            res.json({
                users,
                currentPage: page,
                totalPages,
            });
        } else {
            // Initial page load: Render the full EJS template
            renderAdminPage(req, res, 'AUser', {
                users,
                currentPage: page,
                totalPages,
                nameFilter: req.query.name,
                emailFilter: req.query.email,
                sortBy: req.query.sortBy
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// Ban/Unban User - POST
router.post('/users/ban/:id', isAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;
        // Prevent admin from banning themselves
        if (req.user.id === userId) {
            return res.status(400).json({ error: "Admin cannot ban themselves." });
        }

        const user = await Account.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (action === 'ban') {
            user.isBanned = true;
        } else if (action === 'unban') {
            user.isBanned = false;
        }

        await user.save();
        res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Change User Role - POST
router.post('/users/change-role/:id', isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await Account.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Manage Products - GET
router.get('/products', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        let query = {};
        let sortOption = { createdAt: -1 }; // Default sort

        // Filter by name
        if (req.query.name) {
            query.name = new RegExp(req.query.name, 'i');
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Sort options
        if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case 'name':
                    sortOption = { name: 1 };
                    break;
                case 'price':
                    sortOption = { price: 1 };
                    break;
                case 'createdAt':
                    sortOption = { createdAt: -1 };
                    break;
            }
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(perPage)
            .populate('category');

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / perPage);

        const categories = await Category.find({}); // Fetch all categories

        if (req.xhr) {
            // AJAX request: Send only JSON data
            res.json({
                products,
                currentPage: page,
                totalPages,
            });
        } else {
            // Initial page load: Render the full EJS template
            renderAdminPage(req, res, 'AProduct', {
                products,
                categories,
                currentPage: page,
                totalPages,
                nameFilter: req.query.name,
                categoryFilter: req.query.category,
                sortBy: req.query.sortBy
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Manage Orders - GET
router.get('/orders', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 10;
        const skip = (page - 1) * perPage;

        let query = {};
        let sortOption = { orderDate: -1 }; // Default sort by order creation time (newest first)

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(perPage)
            .populate('account', 'first_name last_name email') // Populate basic user info
            .populate('products.product', 'name price'); // Populate basic product info

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / perPage);

        if (req.xhr) {
            // AJAX request: Send only JSON data
            res.json({
                orders,
                currentPage: page,
                totalPages,
            });
        } else {
            // Initial page load: Render the full EJS template
            renderAdminPage(req, res, 'AOrder', {
                orders,
                currentPage: page,
                totalPages,
                statusFilter: req.query.status,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// View Order Details - GET
router.get('/orders/:id', isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('account', 'first_name last_name email') // Populate user details
            .populate('products.product');

        if (!order) {
            return res.status(404).send('Order not found');
        }

        renderAdminPage(req, res, 'AOrderDetail', { order });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Order Status - POST
router.post('/orders/update-status/:id', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;
