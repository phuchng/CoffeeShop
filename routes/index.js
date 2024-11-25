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

  return res.render('search', { search: search, products: products});
})

module.exports = router;
