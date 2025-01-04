var express = require('express');
var { Product } = require('../models/Product');
var router = express.Router();
var { isAuthenticated } = require('../middleware/authentication');
const Order = require('../models/Order');

router.get('/', isAuthenticated, async (req, res, next) => {
    const userID = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const skip = (page - 1) * perPage; 
    const orders = await Order.find({ account: userID }).skip(skip).limit(perPage);
    const formattedOrders = orders.map(order => ({
        id: order._id,
        totalItems: order.totalItems,
        orderDate: order.orderDate.toISOString().split('T')[0],
      }));
    const totalProducts = await Order.countDocuments({ account: userID }); // Count total products matching the query
    const totalPages = Math.ceil(totalProducts / perPage); // Calculate total pages
    if (req.xhr) {
        // AJAX request: Send only JSON data for reviews
        res.json({
            orders: formattedOrders,
            currentPage: page,
            totalPages: totalPages
        });
    }

    else{
        res.render('order', {
            orders: orders,
            currentPage: page,
            totalPages: totalPages
        });
    }
});

router.get('/orderDetail/:id', isAuthenticated, async (req, res, next) => {
    const orderID = req.params.id;

    const orderFind = await Order.findById(orderID);
    const products = await Promise.all(orderFind.products.map(async (item) => {
        try {
            // Fetch the product by its ID
            const product = await Product.findById(item.product);
            console.log(product.name)
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

    const shipTime = orderFind.shipTime.toISOString().split('T')[0];

    const order = {
        address: orderFind.address,
        shipTime: shipTime,
        totalPrice: orderFind.totalPrice
    };

    res.render('orderItem', { order: order, products: products })
})

module.exports = router