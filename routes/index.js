var express = require('express');
var product = require('../models/Product')
var router = express.Router();

/* GET users listing. */

router.get('/', async function(req, res, next) {
  const productList = await product.find({});

  res.render('shop', { title: 'Coffeeno', productList: productList })
});

router.get('/product/:id', async function(req, res, next) {
  const productID = req.params.id;
  const productList = await product.find({}).limit(4);
  const productDetail = await product.findById(productID);
  res.render('detail', { title: 'Detail', productList: productList, product: productDetail });
});

router.get('/search', async function(req, res, next) {
  const query = req.query.query;
  const searchResults = await product.find({ name: { $regex: query, $options: 'i' } });
  res.render('search', { title: 'Search Results', searchResults: searchResults, query: query });
});

router.get('/filter', async function(req, res, next) {
  const filter = req.query.filter;
  const filteredProducts = await product.find({ category: filter });
  res.render('shop', { title: 'Filtered Products', productList: filteredProducts });
});

module.exports = router;
