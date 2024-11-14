const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String, // URL or path to the image
  description: String,
});

module.exports = mongoose.model('Category', CategorySchema);