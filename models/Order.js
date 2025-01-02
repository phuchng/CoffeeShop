const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        servingOption: {
            type: String,
            required: true
        }
    }],
    address: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now // Automatically set the order date
    },
    shipTime: {
        type: Date, // Example: "10:00 AM - 11:00 AM"
        required: true
    },
    discountCode: {
        type: String, // Optional: Discount code used during the order
        default: null
    },
    specialInstruction: String,
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    }
});

// Export Order Model
const Order = mongoose.model('Order', OrderSchema)
module.exports = Order;