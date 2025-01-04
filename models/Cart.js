const mongoose = require('mongoose');
const { Product } = require('./Product')

const CartSchema = new mongoose.Schema({
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1 // Ensure at least one product is added
          },
          servingOption: {
            type: String,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },

    totalItems: {
        type: Number,
        required: true,
        default: 0
    }

})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;