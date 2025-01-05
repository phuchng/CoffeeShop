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
    address:
    {
        first_name: String,
        last_name: String,
        company: String,
        address: String,
        apartment: String,
        phone: String,
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalItems: {
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
// Calculate total revenue for an order
OrderSchema.virtual('revenue').get(function () {
    return this.products.reduce((total, product) => {
        return total + (product.quantity * product.product.price);
    }, 0);
});

// Export Order Model
const Order = mongoose.model('Order', OrderSchema)
module.exports = Order;
