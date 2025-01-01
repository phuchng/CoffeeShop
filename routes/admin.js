const express = require('express');
const router = express.Router();
const { Product, Tag } = require('../models/Product');
const Account = require('../models/Account');
const { isAdmin } = require('../middleware/authentication');
const bcrypt = require('bcrypt');

// Dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const totalUsers = await Account.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments({});
        res.render('Admin/ADashboard', { layout: 'layouts/layoutAdmin', totalUsers, totalProducts });
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

        const users = await Account.find({ role: 'user' }).skip(skip).limit(perPage);
        const totalUsers = await Account.countDocuments({ role: 'user' });
        const totalPages = Math.ceil(totalUsers / perPage);

        res.render('Admin/AUser', { layout: 'layouts/layoutAdmin', users, currentPage: page, totalPages });
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

        res.render('Admin/AProduct', { layout: 'layouts/layoutAdmin', products, currentPage: page, totalPages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - GET
router.get('/products/add', isAdmin, async (req, res) => {
    try {
        const tags = await Tag.find({});
        res.render('Admin/AAddProduct', { layout: 'layouts/layoutAdmin', tags });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Add Product - POST
router.post('/products/add', isAdmin, async (req, res) => {
    try {
        const { name, price, description, category, tag, servingOptions, grind, roast, origin, ingredients } = req.body;

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
            ingredients: ingredients.split(',')
            // image: req.file.filename // Assuming you are using multer for file uploads
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
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('Admin/AUpdateProduct', { layout: 'layouts/layoutAdmin', product, tags });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Update Product - POST
router.post('/products/update/:id', isAdmin, async (req, res) => {
    try {
        const { name, price, description, category, tag, servingOptions, grind, roast, origin, ingredients } = req.body;
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
            ingredients: ingredients.split(',')
            // image: req.file ? req.file.filename : currentImage
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }

        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete Product
router.get('/products/delete/:id', isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Product Detail
router.get('/products/:id', isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('Admin/Adetail', { layout: 'layouts/layoutAdmin', product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Admin Profile - GET
router.get('/profile', isAdmin, (req, res) => {
    res.render('Admin/AProfile', { layout: 'layouts/layoutAdmin', admin: req.user });
});

// Change Password - GET
router.get('/change-password', isAdmin, (req, res) => {
    res.render('Admin/AChangePass', { layout: 'layouts/layoutAdmin' });
});

// Change Password - POST
router.post('/change-password', isAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const admin = await Account.findById(req.user.id);

        if (!await bcrypt.compare(currentPassword, admin.password)) {
            return res.status(400).send('Incorrect current password');
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).send('New passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.redirect('/admin/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Create New Admin - GET
router.get('/create-admin', isAdmin, (req, res) => {
    res.render('Admin/ACreateNewAdmin', { layout: 'layouts/layoutAdmin' });
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

module.exports = router;