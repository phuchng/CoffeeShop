var express = require('express');
var product = require('../models/Product')
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  const productList = await product.find({});

  return res.render('shop', { title: 'Coffeeno', productList: productList })
});

router.get('/product/:id', async function(req, res, next) {
  const productID = req.params.id;
  const productList = await product.find({}).limit(4);
  const productDetail = await product.findById(productID);
  return res.render('detail', { title: 'Detail', productList: productList, product: productDetail });
});

router.get('/search', async function(req, res, next) {
  const search = req.query.search;
  const products = await product.find({ $or: [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { category: { $regex: search, $options: 'i' } }
  ]});
  res.render('search', { title: 'Search Results', search: search, products: products });
});

router.get('/filter', async function(req, res, next) {
  let query = {};

  // Filter by category
  if (req.query.category) {
      if (Array.isArray(req.query.category)) {
          query.category = { $in: req.query.category };
      } else {
          query.category = req.query.category;
      }
  }

  // Filter by price range
  if (req.query.priceRange) {
      const priceRange = req.query.priceRange.split('-');
      if (priceRange.length === 2) {
          query.price = { $gte: Number(priceRange[0]), $lte: Number(priceRange[1]) };
      } else if (req.query.priceRange === '50+') {
          query.price = { $gte: 50 };
      }
  }
  // Filter by grind
  if (req.query.grind) {
      if (Array.isArray(req.query.grind)) {
          query.grind = { $in: req.query.grind };
      } else {
          query.grind = req.query.grind;
      }
  }

  // Filter by roast level
  if (req.query.roast) {
      if (Array.isArray(req.query.roast)) {
          query.roast = { $in: req.query.roast };
      } else {
          query.roast = req.query.roast;
      }
  }
  const filteredProducts = await product.find(query);
  res.render('shop', { title: 'Filtered Products', productList: filteredProducts });
});



router.get('/sort', async function(req, res, next) {
  const sortOption = req.query.sort;
  let sortedProducts;

  if (sortOption === 'best-selling') {
    sortedProducts = await product.find({}).sort({ sales: -1 });
  } else if (sortOption === 'price-low-high') {
    sortedProducts = await product.find({}).sort({ price: 1 });
  } else if (sortOption === 'price-high-low') {
    sortedProducts = await product.find({}).sort({ price: -1 });
  } else {
    sortedProducts = await product.find({});
  }

  res.render('shop', { title: 'Sorted Products', productList: sortedProducts });
});

module.exports = router;
