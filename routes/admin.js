const express = require('express');
const router = express.Router();
const { Product, Tag } = require('../models/Product');
const Account = require('../models/Account');
const { isAdmin } = require('../middleware/authentication');
const bcrypt = require('bcrypt');
const Category = require('../models/Category');
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

// User Management
router.get('/users', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const skip = (page - 1) * perPage;

        // Fetch users and admins separately
        const users = await Account.find({ role: 'user' }).skip(skip).limit(perPage);
        const admins = await Account.find({ role: 'admin' }).skip(skip).limit(perPage);

        const totalUsers = await Account.countDocuments({ role: 'user' });
        const totalAdmins = await Account.countDocuments({ role: 'admin' });

        const totalPagesUsers = Math.ceil(totalUsers / perPage);
        const totalPagesAdmins = Math.ceil(totalAdmins / perPage);

        if (req.xhr) {
            // Respond with JSON for AJAX requests
            res.json({
                users,
                admins,
                currentPage: page,
                totalPagesUsers,
                totalPagesAdmins
            });
        } else {
            // Render the full page for initial requests
            renderAdminPage(req, res, 'AUser', {
                users,
                admins,
                currentPage: page,
                totalPagesUsers,
                totalPagesAdmins
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Product Management
router.get('/products', isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const skip = (page - 1) * perPage;

        const products = await Product.find({}).skip(skip).limit(perPage);
        const totalProducts = await Product.countDocuments({});
        const totalPages = Math.ceil(totalProducts / perPage);

        if (req.xhr) {
            // Respond with JSON for AJAX requests
            res.json({
                products,
                currentPage: page,
                totalPages
            });
        } else {
            // Render the full page for initial requests
            renderAdminPage(req, res, 'AProduct', {
                products,
                currentPage: page,
                totalPages
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - GET
router.get('/products/add', isAdmin, async (req, res) => {
    try {
        const tags = await Tag.find({});
        const categories = await Category.find({});
        renderAdminPage(req, res, 'AAddProduct', { tags, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - POST
router.post('/products/add', isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, category, tag, servingOptions, grind, roast, origin, ingredients } = req.body;

        const imagePaths = req.files.map(file => file.filename);
        const firstImagePath = imagePaths.length > 0 ? imagePaths[0] : null;

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            tag,
            servingOptions: servingOptions.split(','),
            grind,
            roast,
            origin,
            ingredients: ingredients.split(','),
            image: firstImagePath,
            images: imagePaths
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
        const tags = await Tag.find({});
        const categories = await Category.find({});
        if (!product) {
            return res.status(404).send('Product not found');
        }
        renderAdminPage(req, res, 'AUpdateProduct', { product, tags, categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Product - POST
router.post('/products/update/:id', isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, category, tag, servingOptions, grind, roast, origin, ingredients } = req.body;
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
            tag,
            servingOptions: servingOptions.split(','),
            grind,
            roast,
            origin,
            ingredients: ingredients.split(','),
            image: firstImagePath,
            images: updatedImagePaths
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
            role: 'admin'
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
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
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
        const { name, description } = req.body;
        await Category.findByIdAndUpdate(req.params.id, { name, description });
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

module.exports = router;