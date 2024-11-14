const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String, // URL or path to the image
  date: { type: Date, default: Date.now },
  content: String,
});

module.exports = mongoose.model('Blog', BlogSchema);
