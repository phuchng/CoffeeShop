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

module.exports = router;
