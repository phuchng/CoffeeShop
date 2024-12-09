const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String, // URL or path to the image
  description: String,
  price: Number,
  category: String,
  servingOptions: [String],
  grind: { type: String, enum: ['Whole Bean', 'Ground'] },
  roast: { type: String, enum: ['Light', 'Medium', 'Dark'] },
  origin: String,
  ingredients: [String],
  sales: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', ProductSchema);