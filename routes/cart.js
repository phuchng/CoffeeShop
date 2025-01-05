// File: routes\cart.js

var express = require('express');
var { Product } = require('../models/Product');
var Account = require('../models/Account');
var Cart = require('../models/Cart')
var router = express.Router();
var { isAuthenticated } = require('../middleware/authentication');
const Order = require('../models/Order');

router.get('/', isAuthenticated, async (req, res, next) => {
    const userID = req.user.id;

    try {
        const cart = await Cart.findOne({ account: userID });

        if (!cart) {
            const newCart = new Cart({ account: userID });
            await newCart.save();
            return res.render('cart', { cartItems: [], totalPrice: 0, totalItems: 0 });
        }

        if (!cart.products || cart.products.length === 0) {
            return res.render('cart', { cartItems: [], totalPrice: 0, totalItems: 0 });
        }

        const cartItems = await Promise.all(cart.products.map(async (item) => {
            try {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found with ID: ${item.product}`);
                }
                return {
                    id: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: item.quantity,
                    servingOption: item.servingOption,
                    totalCost: (product.price * item.quantity).toFixed(2),
                };
            } catch (error) {
                console.error('Error fetching product:', error);
                return null;
            }
        }));

        // Filter out any null values in case of errors
        const validCartItems = cartItems.filter(item => item !== null);

        return res.render('cart', { cartItems: validCartItems, totalPrice: cart.totalPrice, totalItems: cart.totalItems });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).render('error', { message: 'Error fetching cart', error: error });
    }
});

router.post('/add-cart', isAuthenticated, async (req, res, next) => {
    const { productID, quantity, servingOption } = req.body;
    const accountID = req.user.id;

    try {
        const cart = await Cart.findOne({ account: accountID }) || new Cart({ account: accountID });

        const existingItem = cart.products.find(
            (item) => item.product.toString() === productID && item.servingOption === servingOption
        );

        if (existingItem) {
            existingItem.quantity += parseInt(quantity); // Ensure quantity is a number
        } else {
            cart.products.push({ product: productID, quantity: parseInt(quantity), servingOption });
        }

        const productFound = await Product.findById(productID);
        if (!productFound) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        cart.totalPrice += productFound.price * parseInt(quantity);
        cart.totalItems += parseInt(quantity); // Ensure quantity is a number
        await cart.save();
        res.json({ success: true, message: 'Product added to cart successfully!' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add product to cart.' });
    }
});

router.delete('/remove-item', isAuthenticated, async (req, res, next) => {
    const { productID, servingOption } = req.body;
    const accountID = req.user.id;

    try {
        const cart = await Cart.findOne({ account: accountID });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productID && item.servingOption === servingOption);

        if (productIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart.' });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Recalculate total price
        let totalPrice = 0;
        let totalItems = 0
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                totalItems += item.quantity;
                totalPrice += product.price * item.quantity;
            }
        }

        cart.totalPrice = totalPrice;
        cart.totalItems = totalItems; 
        await cart.save();

        res.status(200).json({ success: true, message: 'Product removed from cart.', newTotalPrice: totalPrice, newTotalItems: totalItems });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove product from cart.' });
    }
});

router.post('/order', isAuthenticated, async (req, res, next) => {
    const orderDate = Date.now();
    const shipTime = orderDate + 24 * 60 * 60 * 1000;
    const accountID = req.user.id;

    try {
        const cart = await Cart.findOne({ account: accountID }).populate('products.product');
        const user = await Account.findById(accountID);

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty!' });
        }

        const newOrder = new Order({
            account: accountID,
            orderDate: orderDate,
            shipTime: shipTime,
            products: cart.products,
            address: user.address,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems
        });

        await newOrder.save();

        // Clear the user's cart after order submission
        cart.products = [];
        cart.totalPrice = 0;
        cart.totalItems = 0;
        await cart.save();

        res.status(200).json({ success: true, message: 'Order submitted successfully.' });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ success: false, message: 'Failed to submit order.' });
    }
});

module.exports = router;