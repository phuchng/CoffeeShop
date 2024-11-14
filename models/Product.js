const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String, // URL or path to the image
  description: String,
  price: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  servingOptions: [String],
});

module.exports = mongoose.model('Product', ProductSchema);
