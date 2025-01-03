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

    const cart = await Cart.findOne({ account: userID });

    if (!cart){
        const newCart = new Cart({ account: userID });
        await newCart.save();
        const cartItems = []
        return res.render('cart', { layout: 'layouts/layoutProfile', cartItems: cartItems, totalPrice: 0 });
    }

    if (!cart.products){
        const cartItems = []
        return res.render('cart', { layout: 'layouts/layoutProfile', cartItems: cartItems, totalPrice: 0 });
    }

    const cartItems = await Promise.all(cart.products.map(async (item) => {
        try {
            // Fetch the product by its ID
            const product = await Product.findById(item.product);
            
            if (!product) {
                throw new Error(`Product not found with ID: ${item.product}`);
            }
            // Return cart item with product details
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
            return null; // In case of error, return null
        }
    }))

    return res.render('cart', { layout: 'layouts/layoutProfile', cartItems: cartItems, totalPrice: cart.totalPrice });
})


router.post('/add-cart', isAuthenticated, async (req, res, next) => {
    const { productID, quantity, servingOption } = req.body;

    const accountID = req.user.id;

    try{
        const cart = await Cart.findOne({ account: accountID }) || new Cart({ account: accountID });

        const existingItem = cart.products.find(
            (item) => item.product.toString() === productID && item.servingOption === servingOption
        );

        if (existingItem){
            existingItem.quantity += quantity;
        }

        else{
            cart.products.push({ product: productID, quantity, servingOption });
        }

        const productFound = await Product.findById(productID);
        const price = productFound.price;
        cart.totalPrice += price * parseInt(quantity);
        await cart.save();
        res.json({ success: true, message: 'Product added to cart successfully!' });
    }
    catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add product to cart.' });
    }
})

router.delete('/remove-item', isAuthenticated, async (req, res, next) => {
    const { productID, servingOption } = req.body;

    const accountID = req.user.id;

    try{
        const cart = await Cart.findOne({ account: accountID });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        const initialSize = cart.products.length;

        cart.products = cart.products.filter(item => item.product.toString() !== productID || item.servingOption !== servingOption);

        if (initialSize === cart.products.length) {
            return res.status(404).json({ success: false, message: 'Product not found in cart.' });
        }

        let totalPrice = 0;

        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                totalPrice += product.price * item.quantity;
            }
        }

        cart.totalPrice = totalPrice;
        await cart.save();

        res.status(200).json({ success: true, message: 'Product removed from cart.', newTotalPrice: totalPrice });
    }
    catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove product from6 cart.' });
    }
})

router.post('/order', isAuthenticated, async (req, res, next) => {
    const { address, shipTime, specialInstruction } = req.body;
    if (!address || !shipTime){
        return res.status(400).json({ error: 'Address or Ship Time is Missing!'})
    }

    const accountID = req.user.id;
    try {
        // Retrieve the user's cart
        const cart = await Cart.findOne({ account: accountID }).populate('products.product');

        if (!cart || cart.products.length === 0){
            return res.status(400).json({ error: 'Cart is Empty!'})
        }

        const newOrder = new Order({
            account: accountID,
            products: cart.products,
            totalPrice: cart.totalPrice,
            orderDate: new Date(),
            shipTime: shipTime,
            specialInstruction: specialInstruction || null
        })

        await newOrder.save();

        // Clear the user's cart after order submission
        cart.products = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ success: true, message: 'Order submitted successfully.' });
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).json({ success: false, message: 'Failed to submit order.' });
      }
})

module.exports = router;