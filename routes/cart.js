// File: routes\cart.js

var express = require('express');
var { Product } = require('../models/Product');
var Account = require('../models/Account');
var Cart = require('../models/Cart')
var router = express.Router();
var { isAuthenticated } = require('../middleware/authentication')

router.get('/', isAuthenticated, async (req, res, next) => {
    const userID = req.user.id;

    const cart = await Cart.findOne({ account: userID }).populate('products.product');

    const cartItems = cart.products.map((item) => ({
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        servingOption: item.servingOption,
        totalCost: (item.product.price * item.quantity).toFixed(2),
    }));

    return res.render('cart', { layout: 'layoutProfile', cartItems: cartItems, totalPrice: cart.totalPrice })
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

        await cart.save();
        res.json({ success: true, message: 'Product added to cart successfully!' });
    }
    catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add product to cart.' });
    }
})

router.delete('/remove-item', isAuthenticated, async (req, res, next) => {
    const { productId, servingOption } = req.body;

    const accountID = req.user.id;

    try{
        const cart = await Cart.findOne({ account: accountID });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        const initialSize = cart.products.length;

        cart.products = cart.products.filter(item => item.product.toString() !== productId || item.servingOption !== servingOption);

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

module.exports = router;