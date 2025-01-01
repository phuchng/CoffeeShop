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

})

CartSchema.pre('save', async function (next) {
    const cart = this;

    let totalPrice = 0;
    let totalProducts = 0;

    for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
          totalPrice += product.price * item.quantity;
          totalProducts += item.quantity;
        }
      }

    cart.totalPrice = totalPrice;
    cart.totalProducts = totalProducts;

    next();
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;